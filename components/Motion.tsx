'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Движение на странице.
 *
 * Раньше всё это было на CSS animation-timeline. Красиво, ноль килобайт — и
 * ровно поэтому неправильно: animation-timeline умеют Chrome, Edge и Safari
 * 26, а Firefox держит за флагом. На телефоне с чем угодно другим не
 * работало ничего, и это выяснилось единственным честным способом — сайт
 * открыли на телефоне.
 *
 * Здесь то же самое ведёт JS, и работает везде одинаково. Стоит это около
 * полутора килобайт против тридцати пяти за GSAP.
 *
 * Устройство:
 *  - на <html> вешается класс motion, и только под ним что-либо прячется.
 *    Не отработал JS — страница просто статичная и полностью читаемая;
 *  - [data-scene] считает свой прогресс 0..1 и проматывает кадры дочерних
 *    анимаций отрицательной задержкой у приостановленной анимации. Приём
 *    старый и работает в любом браузере;
 *  - .sd проявляется по IntersectionObserver;
 *  - .cnt досчитывает число по тому же прогрессу.
 *
 * Всё пишется в transform/opacity и только внутри requestAnimationFrame,
 * поэтому раскладка не пересчитывается.
 */
export default function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    // matchMedia есть не везде — в jsdom его нет. Без него не прячем ничего:
    // статичная и полностью видимая страница всегда лучше пустой.
    if (typeof window.matchMedia !== 'function') {
      document.querySelectorAll('.sd').forEach(el => el.classList.add('in'))
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia('(min-width: 900px)')

    // На десктопе хореографию ведёт GSAP (ScrollScenes). Здесь остаётся
    // только то, что нужно телефонам: проявления и читаемая раскладка.
    // Иначе оба драйвера писали бы в одни и те же элементы.
    const heavy = !window.matchMedia('(max-width: 899px)').matches
      && !window.matchMedia('(pointer: coarse)').matches

    if (reduce.matches) {
      document.documentElement.classList.remove('motion')
      document.querySelectorAll('.sd').forEach(el => el.classList.add('in'))
      return
    }
    document.documentElement.classList.add('motion')

    // ── Проявление блоков ──────────────────────────────────────────────
    const sd = Array.from(document.querySelectorAll<HTMLElement>('.sd'))
    let observerAlive = false
    const io = new IntersectionObserver(
      entries => {
        observerAlive = true
        entries.forEach(e => {
          if (!e.isIntersecting) return
          e.target.classList.add('in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    sd.forEach(el => io.observe(el))

    // Страховка на случай, если наблюдатель не подаёт признаков жизни:
    // тогда показываем всё разом, потому что пустая страница хуже
    // пропавшей анимации.
    //
    // Проверяется именно «не подаёт признаков жизни», а не «прошло две
    // секунды». Первая версия показывала все блоки по таймеру безусловно —
    // и тем самым отменяла проявление при прокрутке, ради которого всё
    // и затевалось.
    const safety = window.setTimeout(() => {
      if (observerAlive) return
      sd.forEach(el => el.classList.add('in'))
    }, 2000)

    // ── Сцены и счётчики ───────────────────────────────────────────────
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    const counters = Array.from(document.querySelectorAll<HTMLElement>('.cnt'))

    // Закреплённая сцена включается только на широком экране: три экрана
    // прокрутки ради трёх абзацев на телефоне — издевательство, да и
    // карточки там просто лягут одна на другую.
    const applySceneMode = () => {
      scenes.forEach(s => {
        if (wide.matches && !heavy) s.setAttribute('data-scene', 'on')
        else {
          s.removeAttribute('data-scene')
          s.setAttribute('data-scene-off', '')
          s.querySelectorAll<HTMLElement>('.scene-step').forEach(st => {
            st.style.animationDelay = ''
          })
        }
      })
    }

    const progressOf = (el: HTMLElement, span: number) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = r.height - vh * span
      if (total <= 0) return r.top <= 0 ? 1 : 0
      return Math.max(0, Math.min(1, -r.top / total))
    }

    const paint = () => {
      if (wide.matches && !heavy) {
        scenes.forEach(scene => {
          const p = progressOf(scene, 1)
          scene.style.setProperty('--p', String(p))
          // Отрицательная задержка у приостановленной анимации выбирает кадр:
          // длительность ровно 1s, значит -p секунд = доля p от анимации.
          scene.querySelectorAll<HTMLElement>('.scene-step, .scene-dots li').forEach(st => {
            st.style.animationDelay = `${-p}s`
          })
        })
      }

      if (heavy) return
      counters.forEach(c => {
        const r = c.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.55)))
        const target = Number(c.dataset.target || 0)
        const anim = c.querySelector<HTMLElement>('.cnt-anim')
        if (anim) anim.textContent = Math.round(target * p).toLocaleString('ru-RU')
      })
    }

    // Кадровый цикл вместо подписки на событие прокрутки.
    //
    // На странице работает Lenis (инерционная прокрутка), и он забирает
    // события себе: window больше не получает ни одного 'scroll'. Проверено
    // замером — счётчик событий остался на нуле, пока страница уезжала на
    // полторы тысячи пикселей. Поэтому позицию опрашиваем сами.
    //
    // Кадр, в котором ничего не сдвинулось, стоит одного сравнения чисел.
    let raf = 0
    let lastY = -1
    let lastH = -1

    const tick = () => {
      const y = window.scrollY
      const h = window.innerHeight
      if (y !== lastY || h !== lastH) {
        lastY = y
        lastH = h
        paint()
      }
      raf = requestAnimationFrame(tick)
    }

    applySceneMode()
    paint()
    raf = requestAnimationFrame(tick)
    wide.addEventListener('change', applySceneMode)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(safety)
      io.disconnect()
      wide.removeEventListener('change', applySceneMode)
    }
  }, [pathname])

  return null
}
