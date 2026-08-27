'use client'
import { useEffect, useRef } from 'react'

/**
 * Чернильное поле: снимок краски в воде, прогнанный через полутоновый растр.
 *
 * Как сюда пришли. Первые три подхода рисовали фон формулой — интерференция
 * синусоид, гильош-розетки, домен-варп шума. Все три забракованы, и по одной
 * причине: у образца (Lama Lama, Site of the Month) фон это не узор, а
 * снятый материал, пропущенный через точечный растр. Математикой можно
 * подделать фактуру, но не повадку настоящего кадра.
 *
 * Теперь материал настоящий: макроснимок чернил, расходящихся в воде,
 * сгенерированный через Higgsfield и лежащий в public/. Растр остался тем
 * же — он и даёт «отпечатанный» вид. Для нотариуса приём вдвойне уместен:
 * чернила и печать растром — это язык самого документа.
 *
 * Снимок неподвижен, поэтому кадр дышит за счёт мелкого искажения координат
 * по времени, отъезжает при прокрутке и изгибается линзой под курсором.
 *
 * Вес: 172 КБ вместо 7.7 МБ исходника — кадр обрезан от киноперфорации и
 * пережат. Грузится только там, где рисуется.
 *
 * На телефонах и при prefers-reduced-motion не запускается вовсе.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2      u_res;
uniform float     u_time;
uniform vec2      u_mouse;
uniform float     u_scroll;   // 0..1 по закреплённому экрану
uniform vec3      u_bg;
uniform vec3      u_ink;
uniform vec3      u_hot;
uniform sampler2D u_tex;      // снимок чернил в воде
uniform vec2      u_texRes;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

/* Лёгкое искажение координат по времени: снимок неподвижен, но кадр
   должен дышать. Смещение мелкое — крупное превратило бы фотографию в
   желе, а нужно ощущение медленно расходящейся краски. */
vec2 drift(vec2 uv, float t){
  float a = sin(uv.y * 3.1 + t * 0.30) * 0.006;
  float b = cos(uv.x * 2.7 - t * 0.24) * 0.006;
  return uv + vec2(a, b);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 sc = frag / u_res;

  // Кадрирование «cover»: снимок закрывает экран без растяжения.
  float sa = u_res.x / u_res.y;
  float ta = u_texRes.x / u_texRes.y;
  vec2 uv = sc;
  if (sa > ta) uv.y = (uv.y - 0.5) * (ta / sa) + 0.5;
  else         uv.x = (uv.x - 0.5) * (sa / ta) + 0.5;

  // Прокрутка отъезжает и уводит кадр вверх — как смена плана.
  uv = (uv - 0.5) * (1.0 - u_scroll * 0.16) + 0.5;
  uv.y += u_scroll * 0.10;

  // Линза под курсором.
  vec2 m = u_mouse;
  float d = length((uv - m) * vec2(sa / max(sa, 1.0), 1.0));
  float lens = exp(-d * d * 5.0);
  uv += (uv - m) * lens * 0.16;

  uv = drift(uv, u_time);

  float v = 1.0 - texture2D(u_tex, clamp(uv, 0.0, 1.0)).r;   // краска = тёмное
  v = clamp((v - 0.18) * 1.45, 0.0, 1.0);

  float dens = v;
  float hot  = pow(clamp((v - 0.72) * 3.0, 0.0, 1.0), 1.4);

  /* Полутоновый растр. Диаметр точки — от плотности краски. Именно эта
     точечная сетка, а не сам кадр, даёт «отпечатанный» вид, ради которого
     всё и затевалось: у образца ровно так обработано видео. Сетка
     повёрнута на 22.5°, как в типографской печати. */
  float ang = 0.3927;
  vec2 rot = vec2(frag.x * cos(ang) - frag.y * sin(ang),
                  frag.x * sin(ang) + frag.y * cos(ang));
  float cell = 5.0;
  vec2 g = fract(rot / cell) - 0.5;
  float dotR = length(g) * 2.0;
  float tone = 1.0 - smoothstep(dens * 1.30 - 0.10, dens * 1.30 + 0.10, dotR);

  // К краям кадр гаснет, чтобы не спорить с текстом.
  float vig = 1.0 - smoothstep(0.35, 1.05, length(sc - vec2(0.5)) * 1.5);

  vec3 col = mix(u_bg, u_ink, tone * 0.95 * vig);
  col = mix(col, u_hot, hot * tone * 0.55 * vig);
  col += (hash(frag + u_time) - 0.5) * 0.014;

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
      tex: gl.getUniformLocation(prog, 'u_tex'),
      texRes: gl.getUniformLocation(prog, 'u_texRes'),
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      scroll: gl.getUniformLocation(prog, 'u_scroll'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      ink: gl.getUniformLocation(prog, 'u_ink'),
      hot: gl.getUniformLocation(prog, 'u_hot'),
    }

    // Текстура. Пока не загрузилась — рисуем ровный фон, а не мусор.
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    let texW = 1, texH = 1
    let disposed = false

    const img = new Image()
    img.decoding = 'async'
    img.src = '/ink-paper.jpg'
    img.onload = () => {
      if (disposed) return
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      texW = img.naturalWidth
      texH = img.naturalHeight
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
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(U.tex, 0)
      gl.uniform2f(U.texRes, texW, texH)
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
      disposed = true
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
