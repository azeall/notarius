'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Хореография прокрутки на GSAP ScrollTrigger. Только десктоп.
 *
 * Почему библиотека, если раньше всё вело своё колесо на requestAnimationFrame.
 * Своё колесо умеет ровно одно: считать прогресс и промотать кадры. Здесь
 * нужен настоящий пиннинг — раздел физически закрепляется, содержимое внутри
 * него проходит, а страница продолжает считаться правильно по высоте.
 * Написать это самому — значит написать ScrollTrigger, только хуже.
 *
 * Почему не на телефонах. Прямое указание: тяжёлую хореографию на телефоны
 * не тащить. Там остаётся Motion.tsx — полтора килобайта, проявления и
 * читаемая колонка вместо сцены. Первый экран и все разделы там полноценные,
 * просто без закрепления.
 *
 * Lenis (инерционная прокрутка) уже стоит и забирает события scroll себе,
 * поэтому ScrollTrigger переводится на свой тикер и обновляется из кадрового
 * цикла GSAP, а не по событию.
 */
export default function ScrollScenes() {
  const pathname = usePathname()

  useEffect(() => {
    // matchMedia есть не везде: в jsdom его нет вовсе, и обращение к нему
    // роняло весь компонент вместе с первым экраном. Нет — значит тяжёлое
    // не запускаем.
    const mq = (q: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : null

    if (!mq('(min-width: 900px)')) return
    if (mq('(prefers-reduced-motion: reduce)')!.matches) return
    if (mq('(max-width: 899px)')!.matches) return
    if (mq('(pointer: coarse)')!.matches) return

    let cleanup = () => {}
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, mod]) => {
      if (cancelled) return
      const ScrollTrigger = mod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      document.documentElement.classList.add('gsap-on')

      const ctx = gsap.context(() => {
        // ── Первый экран закрепляется ──
        //
        // У образца заголовок стоит на месте три экрана прокрутки, а за ним
        // сменяются кадры. Здесь то же: экран висит, чернила за ним
        // перестраиваются, подпись сверху меняется, а сам заголовок никуда
        // не уезжает — человек читает его столько, сколько нужно.
        //
        // Прогресс кладём в data-атрибут: шейдер читает его оттуда и
        // перестраивает поле. Так GSAP и WebGL согласованы одним числом, а
        // не двумя независимыми расчётами.
        const hero = document.querySelector<HTMLElement>('[data-hero]')
        const tag = hero?.querySelector<HTMLElement>('[data-tag]')
        const TAGS = [
          '[ ' + (document.querySelector('[data-tag]')?.textContent || '').replace(/[\[\]\s]*$|^[\[\]\s]*/g, '') + ' ]',
          '[ Приём по записи · без очередей ]',
          '[ Реестр ФНП · полномочия подтверждены ]',
        ]
        if (hero) {
          hero.setAttribute('data-progress', '0')
          ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 1.1,
            pin: true,
            pinSpacing: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: self => {
              hero.setAttribute('data-progress', self.progress.toFixed(4))
              if (tag) {
                const i = Math.min(TAGS.length - 1, Math.floor(self.progress * TAGS.length))
                if (tag.textContent !== TAGS[i]) tag.textContent = TAGS[i]
              }
            },
          })

          // Пока экран закреплён, содержимое медленно всплывает и гаснет —
          // иначе закрепление читалось бы зависанием, а не приёмом.
          gsap.to('.wh-claim', {
            yPercent: -22, opacity: 0.06, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + window.innerHeight * 1.1, scrub: 0.4 },
          })
          gsap.to('.wh-grid, .wh-areas, .hticker', {
            yPercent: -14, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + window.innerHeight * 0.8, scrub: 0.4 },
          })
        }

        // ── Направления работы: строки въезжают одна за другой ──
        gsap.from('.wh-areas li', {
          yPercent: 60, opacity: 0, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: '.wh-areas', start: 'top 88%', once: true },
        })

        // ── Закреплённые сцены ──
        // Раздел встаёт колом, карточки внутри сменяют друг друга по
        // прогрессу, страница после него продолжается как ни в чём не бывало.
        document.querySelectorAll<HTMLElement>('[data-scene]').forEach(scene => {
          const inner = scene.querySelector<HTMLElement>('.scene-inner')
          const steps = gsap.utils.toArray<HTMLElement>(scene.querySelectorAll('.scene-step'))
          const dots = gsap.utils.toArray<HTMLElement>(scene.querySelectorAll('.scene-dots li i'))
          if (!inner || steps.length === 0) return

          scene.setAttribute('data-scene', 'on')

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              start: 'top top',
              end: () => '+=' + window.innerHeight * (steps.length - 0.35),
              pin: inner,
              pinSpacing: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })

          steps.forEach((step, i) => {
            if (i === 0) {
              gsap.set(step, { autoAlpha: 1, y: 0 })
            } else {
              gsap.set(step, { autoAlpha: 0, y: 40 })
              tl.to(steps[i - 1], { autoAlpha: 0, y: -34, ease: 'power1.inOut' }, i - 0.5)
              tl.to(step, { autoAlpha: 1, y: 0, ease: 'power1.inOut' }, i - 0.5)
            }
            if (dots[i]) {
              gsap.set(dots[i], { scaleX: i === 0 ? 1 : 0, transformOrigin: 'left center' })
              if (i > 0) tl.to(dots[i], { scaleX: 1, ease: 'none' }, i - 0.5)
            }
          })
        })

        // Блоки .sd намеренно НЕ трогаем.
        //
        // Здесь стоял gsap.from('.sd', {opacity: 0}), и это вешало
        // инлайновый opacity:0 на каждый блок. Инлайн перебивает класс .in,
        // который ставит IntersectionObserver, и если триггер не срабатывал —
        // а после закрепления первого экрана позиции смещаются — блоки
        // оставались невидимыми навсегда. Вся страница ниже героя была
        // пустой. Два драйвера на одних элементах — всегда так и кончается.
        //
        // Владелец .sd ровно один: Motion.tsx, на всех устройствах.

        // ── Счётчики досчитывают по прогрессу, а не по таймеру ──
        document.querySelectorAll<HTMLElement>('.cnt').forEach(c => {
          const target = Number(c.dataset.target || 0)
          const out = c.querySelector<HTMLElement>('.cnt-anim')
          if (!out) return
          const box = { v: 0 }
          gsap.to(box, {
            v: target, ease: 'none',
            scrollTrigger: { trigger: c, start: 'top 92%', end: 'top 45%', scrub: 0.4 },
            onUpdate: () => { out.textContent = Math.round(box.v).toLocaleString('ru-RU') },
          })
        })
      })

      // Lenis двигает страницу сам и события scroll до window не доводит:
      // обновляем ScrollTrigger из кадрового цикла.
      // Закрепление меняет высоту документа, а часть триггеров вычислила
      // свои границы до этого. Без пересчёта они срабатывают не там.
      ScrollTrigger.refresh()
      window.addEventListener('load', () => ScrollTrigger.refresh())

      gsap.ticker.add(ScrollTrigger.update)
      const onResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', onResize)

      cleanup = () => {
        window.removeEventListener('resize', onResize)
        gsap.ticker.remove(ScrollTrigger.update)
        ctx.revert()
        ScrollTrigger.getAll().forEach(t => t.kill())
        document.documentElement.classList.remove('gsap-on')
      }
    })

    return () => { cancelled = true; cleanup() }
  }, [pathname])

  return null
}
