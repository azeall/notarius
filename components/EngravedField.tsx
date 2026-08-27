'use client'
import { useEffect, useRef } from 'react'

/**
 * Живая гравюра во весь первый экран.
 *
 * Зачем она есть. У работ, которые на awwwards берут Site of the Month,
 * экран занят плотным визуальным материалом: у Lama Lama — растрированная
 * в дизеринг фотография, у Floema — россыпь вырезанных предметов, у Lando
 * Norris — трёхмерная машина. Сокращение у них в палитре, а не в
 * содержании. Раньше здесь был герб; его убрали как уродливый, а на его
 * место не поставили ничего, и экран стал чистым и пустым одновременно.
 * Это — визуальный объект вместо него.
 *
 * Почему именно гильош. Это язык самих документов: переплетение тонких
 * линий печатают на бланках, векселях и дипломах, и подделать его тяжело
 * именно потому, что рисунок математический. Для нотариуса это не
 * абстрактный узор, а прямая цитата из ремесла.
 *
 * Как устроено. Фрагментный шейдер считает интерференцию нескольких
 * повёрнутых синусоид — получается муар, читаемый как гравировка. Под
 * курсором поле изгибается линзой, при прокрутке медленно разворачивается.
 * Библиотек нет: полноэкранный треугольник и GLSL, вся вещь — несколько
 * килобайт, тогда как three.js стоил бы полутора сотен.
 *
 * Чего здесь нет. На телефонах не запускается вовсе: WebGL на слабом
 * устройстве сажает батарею ради фона. Там остаётся чистый фон, и первый
 * экран от этого не разваливается. Не запускается и при
 * prefers-reduced-motion.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;    // 0..1, сглаженный
uniform float u_scroll;   // 0..1 по первому экрану
uniform vec3  u_bg;
uniform vec3  u_ink;

/* Одна гильош-розетка.
 *
 * Первая версия складывала повёрнутые синусоиды в декартовых координатах.
 * На экране это читалось не плетением, а царапинами: частота была выше
 * разрешения, и рисунок рассыпался в крапинки.
 *
 * Здесь работа идёт в полярных координатах вокруг своего центра: радиус
 * гуляет от угла, отчего кольца превращаются в лепестки. Именно так рисуют
 * розетки на бланках и вексельной бумаге — и именно так выходит рисунок, а
 * не шум. */
float rosette(vec2 p, vec2 c, float petals, float amp, float freq, float phase, float width){
  vec2 q = p - c;
  float r = length(q);
  float a = atan(q.y, q.x);
  float rr = r + amp * sin(petals * a + phase) + amp * 0.4 * sin(petals * 2.0 * a - phase * 0.7);
  float v = abs(sin(rr * freq));
  // Толщина линии растёт к краям, иначе дальние кольца пропадают. Держим её
  // тонкой: на толстой линии рисунок читается корнями, а не гравировкой.
  float w = width * (1.0 + r * 1.6);
  return 1.0 - smoothstep(0.0, w, v);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  // Линза под курсором: поле подтягивается к указателю и слегка вспухает.
  float asp = u_res.x / min(u_res.x, u_res.y);
  vec2 m = (u_mouse - 0.5) * vec2(asp, u_res.y / min(u_res.x, u_res.y));
  float d = length(uv - m);
  float lens = exp(-d * d * 2.6);
  uv += (uv - m) * lens * 0.22;

  // Прокрутка медленно разворачивает поле и слегка его отдаляет.
  float rot = u_scroll * 0.42 + u_time * 0.012;
  float cr = cos(rot), sr = sin(rot);
  uv = vec2(uv.x * cr - uv.y * sr, uv.x * sr + uv.y * cr);
  uv *= 1.0 + u_scroll * 0.28;

  float t = u_time * 0.09;

  // Три розетки с разным числом лепестков. Их наложение и даёт то самое
  // переплетение, которое на бумаге невозможно перерисовать от руки.
  // Центры вынесены за пределы кадра: в самой точке схождения лепестков
  // линии сходятся в звезду, и эта звезда выглядит браком, а не рисунком.
  float g = 0.0;
  g += rosette(uv, vec2(-1.05,  0.34),  5.0, 0.085, 54.0,  t,        0.045);
  g += rosette(uv, vec2( 1.12, -0.28),  7.0, 0.065, 46.0, -t * 0.8,  0.040);
  g += rosette(uv, vec2( 0.18,  1.18), 11.0, 0.045, 36.0,  t * 1.4,  0.034);
  g = clamp(g, 0.0, 1.0);

  // Виньетка: к краям рисунок гаснет, чтобы не спорить с текстом.
  float vig = 1.0 - smoothstep(0.15, 1.15, length(uv) * 0.62);

  // Под курсором гравюра проступает заметно ярче — единственная награда за
  // движение мышью, ничего другого интерактивного здесь нет.
  float strength = (0.26 + lens * 0.55) * vig;

  vec3 col = mix(u_bg, u_ink, g * strength);
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

function readToken(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const p = raw.split(/\s+/).map(Number)
  return p.length === 3 && p.every(n => !Number.isNaN(n))
    ? [p[0] / 255, p[1] / 255, p[2] / 255]
    : fallback
}

export default function EngravedField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    // matchMedia есть не везде: в jsdom его нет вовсе, и обращение к нему
    // роняло весь компонент вместе с первым экраном. Нет — значит тяжёлое
    // не запускаем.
    const mq = (q: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : null

    // Телефоны и «поменьше движения» — мимо. Фон остаётся чистым.
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

    // Полноэкранный треугольник: дешевле двух треугольников квада.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uScroll = gl.getUniformLocation(prog, 'u_scroll')
    const uBg = gl.getUniformLocation(prog, 'u_bg')
    const uInk = gl.getUniformLocation(prog, 'u_ink')

    let bg = readToken('--bg-rgb', [0.1, 0.08, 0.07])
    let ink = readToken('--violet-rgb', [0.88, 0.54, 0.38])

    // Тема переключается на лету — цвета перечитываем, а не кэшируем навсегда.
    const themeWatch = new MutationObserver(() => {
      bg = readToken('--bg-rgb', bg)
      ink = readToken('--violet-rgb', ink)
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Тонкие линии на половинном разрешении рассыпались в крапинки, поэтому
    // рисуем один к одному в CSS-пикселях. Ретину не удваиваем: рисунок
    // мягкий, разницы не видно, а пикселей было бы вчетверо больше.
    const DPR = 1
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * DPR))
      const h = Math.max(1, Math.floor(canvas.clientHeight * DPR))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const mouse = { x: 0.5, y: 0.5 }
    const smooth = { x: 0.5, y: 0.5 }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Пока первый экран за пределами кадра, не рисуем ничего.
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)

    const start = performance.now()
    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      resize()
      smooth.x += (mouse.x - smooth.x) * 0.06
      smooth.y += (mouse.y - smooth.y) * 0.06
      const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform2f(uMouse, smooth.x, smooth.y)
      gl.uniform1f(uScroll, scroll)
      gl.uniform3f(uBg, bg[0], bg[1], bg[2])
      gl.uniform3f(uInk, ink[0], ink[1], ink[2])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)
    canvas.dataset.on = '1'

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
      className="eng"
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
