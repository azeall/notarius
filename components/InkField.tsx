'use client'
import { useEffect, useRef } from 'react'

/**
 * Чернильное поле: клубящаяся краска, прогнанная через полутоновый растр.
 *
 * Третий подход к этому экрану, и первые два были мимо по одной причине:
 * я ни разу не посмотрел образцы в движении, только застывший первый экран.
 * Когда посмотрел — стало видно, что у Lama Lama фон это не узор, а видео,
 * пропущенное через точечный растр, и что заголовок стоит на месте три
 * экрана прокрутки, пока за ним сменяются кадры.
 *
 * Что было и почему не годилось:
 *  1) интерференция синусоид — рассыпалась в царапины;
 *  2) гильош-розетки — вышла паучья сетка. Геометрическая решётка читается
 *     обоями: она статична по характеру, сколько её ни двигай.
 *
 * Здесь вместо решётки — органика. Домен-варп фрактального шума даёт
 * клубящуюся массу, похожую на краску в воде: она не повторяется, всё время
 * перетекает и имеет светящееся ядро. Видео заменить нечем, а вот его
 * повадку воспроизвести можно.
 *
 * Растр (halftone) — главное. Именно точечная сетка, а не сам кадр, даёт тот
 * «отпечатанный» вид. Для нотариуса это ещё и уместно вдвойне: так печатают
 * растром на бумаге.
 *
 * Три состояния: поле перестраивается по мере прокрутки закреплённого
 * экрана — плотность, центр и характер клубов меняются, как сменяются кадры
 * у образца.
 *
 * На телефонах и при prefers-reduced-motion не запускается вовсе.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_scroll;   // 0..1 по закреплённому экрану
uniform vec3  u_bg;
uniform vec3  u_ink;
uniform vec3  u_hot;      // светящееся ядро

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

/* Домен-варп: шум, аргумент которого сам сдвинут другим шумом. Отсюда
   клубы и завихрения вместо равномерной крупы — так ведёт себя краска,
   растекающаяся в воде. */
float ink(vec2 p, float t, out float flow){
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.16)), fbm(p + vec2(5.2, 1.3 - t * 0.11)));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.09),
                fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.07));
  flow = length(r);
  return fbm(p + 3.2 * r);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * u_res) / min(u_res.x, u_res.y);

  // Ядро уходит вверх и уплотняется по мере прокрутки — как смена кадра.
  /* Ядро стоит справа: заголовок занимает левую половину, и масса,
     положенная по центру, спорила бы с ним. У образца ровно так же —
     взрыв справа от центра, надпись слева внизу. */
  vec2 core = vec2(0.34 + 0.18 * sin(u_scroll * 3.1), 0.06 - u_scroll * 0.62);

  // Курсор тянет массу к себе: краска реагирует, а не просто лежит.
  float asp = u_res.x / min(u_res.x, u_res.y);
  vec2 m = (u_mouse - 0.5) * vec2(asp, u_res.y / min(u_res.x, u_res.y));
  float md = length(uv - m);
  uv += (m - uv) * exp(-md * md * 3.0) * 0.16;

  float scale = 1.9 + u_scroll * 1.5;
  float flow = 0.0;
  float v = ink(uv * scale + core * scale, u_time * 0.42 + u_scroll * 2.0, flow);

  // Форма: масса собирается вокруг ядра и растворяется к краям.
  // Порог высокий намеренно: при низком краска заливала весь экран и
  // читалась цветным фоном, а не пятном на глине.
  float dist = length(uv - core);
  // Порог выставлен по фактическому разбросу fbm: пять октав с затуханием
  // вдвое дают значения примерно в 0.30..0.66 со средним около 0.48.
  // При 0.55 краски почти не оставалось, при 0.34 заливало всё.
  float body = smoothstep(1.10, 0.10, dist);
  float dens = clamp((v - 0.38) * 3.4, 0.0, 1.0) * body;

  // Ядро — то, что светится изнутри.
  float hot = pow(clamp((v - 0.60) * 3.2, 0.0, 1.0), 1.5) * smoothstep(0.72, 0.0, dist);

  /* Полутоновый растр. Регулярная точечная сетка, диаметр точки — от
     плотности. Это и есть тот «отпечатанный» вид, который на образце
     принимают за фактуру видео. Сетка чуть повёрнута: строго по осям она
     сразу читается пикселями. */
  float ang = 0.3927;                        // 22.5°, как в типографской печати
  vec2 rot = vec2(frag.x * cos(ang) - frag.y * sin(ang),
                  frag.x * sin(ang) + frag.y * cos(ang));
  float cell = 6.0;
  vec2 g = fract(rot / cell) - 0.5;
  float dotR = length(g) * 2.0;
  /* Точка тем крупнее, чем плотнее краска. Раньше здесь сравнение шло в
     обратную сторону, и точка включалась целиком при любой ненулевой
     плотности — весь экран заливало ровным цветом. */
  float tone = 1.0 - smoothstep(dens * 1.25 - 0.10, dens * 1.25 + 0.10, dotR);

  vec3 col = mix(u_bg, u_ink, tone * 0.95);
  col = mix(col, u_hot, hot * tone * 0.80);

  // Тонкая крупа поверх: убирает полосатость градиента и добавляет зерно.
  col += (hash(frag + u_time) - 0.5) * 0.016;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function token(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const p = raw.split(/\s+/).map(Number)
  return p.length === 3 && p.every(n => !Number.isNaN(n))
    ? [p[0] / 255, p[1] / 255, p[2] / 255]
    : fallback
}

export default function InkField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    // matchMedia есть не везде — в jsdom его нет, и обращение роняло экран.
    const mq = (q: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : null
    if (!mq('(min-width: 900px)')) return
    if (mq('(prefers-reduced-motion: reduce)')!.matches) return
    if (mq('(max-width: 899px)')!.matches) return
    if (mq('(pointer: coarse)')!.matches) return

    const gl = (canvas.getContext('webgl', { antialias: false, alpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: false, alpha: false })) as WebGLRenderingContext | null
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const U = {
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      scroll: gl.getUniformLocation(prog, 'u_scroll'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      ink: gl.getUniformLocation(prog, 'u_ink'),
      hot: gl.getUniformLocation(prog, 'u_hot'),
    }

    let bg = token('--bg-rgb', [0.1, 0.08, 0.07])
    let ink = token('--violet-rgb', [0.88, 0.54, 0.38])
    let hot = token('--text-rgb', [0.95, 0.91, 0.86])
    const themeWatch = new MutationObserver(() => {
      bg = token('--bg-rgb', bg)
      ink = token('--violet-rgb', ink)
      hot = token('--text-rgb', hot)
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Растр сам по себе крупный, поэтому рисуем в CSS-пикселях без ретины.
    const resize = () => {
      const w = Math.max(1, canvas.clientWidth)
      const h = Math.max(1, canvas.clientHeight)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const mouse = { x: 0.5, y: 0.55 }
    const smooth = { x: 0.5, y: 0.55 }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)

    const start = performance.now()
    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      resize()
      smooth.x += (mouse.x - smooth.x) * 0.05
      smooth.y += (mouse.y - smooth.y) * 0.05
      // Прогресс берём с закреплённой сцены, если её ведёт GSAP; иначе —
      // от положения страницы.
      const attr = canvas.closest('[data-hero]')?.getAttribute('data-progress')
      const scroll = attr !== null && attr !== undefined
        ? Number(attr)
        : Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform1f(U.time, (performance.now() - start) / 1000)
      gl.uniform2f(U.mouse, smooth.x, smooth.y)
      gl.uniform1f(U.scroll, Number.isFinite(scroll) ? scroll : 0)
      gl.uniform3f(U.bg, bg[0], bg[1], bg[2])
      gl.uniform3f(U.ink, ink[0], ink[1], ink[2])
      gl.uniform3f(U.hot, hot[0], hot[1], hot[2])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="ink"
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
