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
uniform float     u_scroll;
uniform vec3      u_bg;
uniform vec3      u_ink;
uniform vec3      u_hot;
uniform sampler2D u_tex;
uniform vec2      u_texRes;
uniform vec3      u_trail[10];   // x, y, свежесть 0..1
uniform float     u_stir;        // общая энергия размешивания 0..1

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* Завихрение поля: градиент шума, повёрнутый на 90°. Это curl-noise —
   стандартный способ получить течение без дивергенции, то есть без
   источников и стоков. Краска в таком поле не расползается кляксой, а
   закручивается жгутами, как настоящая в воде. */
vec2 curl(vec2 p, float t){
  float e = 0.06;
  float n1 = fbm(p + vec2(0.0, e) + t);
  float n2 = fbm(p - vec2(0.0, e) + t);
  float n3 = fbm(p + vec2(e, 0.0) - t);
  float n4 = fbm(p - vec2(e, 0.0) - t);
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 sc = frag / u_res;
  float sa = u_res.x / u_res.y;

  // Кадрирование «cover».
  float ta = u_texRes.x / u_texRes.y;
  vec2 uv = sc;
  if (sa > ta) uv.y = (uv.y - 0.5) * (ta / sa) + 0.5;
  else         uv.x = (uv.x - 0.5) * (sa / ta) + 0.5;

  uv = (uv - 0.5) * (1.0 - u_scroll * 0.14) + 0.5;
  uv.y += u_scroll * 0.08;

  /* Течение. Амплитуда крупная намеренно: прежние 0.006 были ниже порога
     заметности, и кадр выглядел приклеенным. Здесь жгуты действительно
     ползут и закручиваются. */
  vec2 fl = curl(uv * 2.6, u_time * 0.05) * 0.030;
  fl += curl(uv * 5.3 + 11.0, -u_time * 0.08) * 0.014;
  uv += fl;

  /* След курсора. Десять последних положений указателя, каждое толкает
     краску от себя и подкручивает её по касательной — как палочкой в воде.
     Свежие точки давят сильнее, старые растворяются. Раньше здесь была одна
     точка и почти нулевое смещение, поэтому за курсором не следовало
     ничего. */
  vec2 push = vec2(0.0);
  float near = 0.0;
  for (int i = 0; i < 10; i++){
    vec2 tp = u_trail[i].xy;
    float life = u_trail[i].z;
    if (life <= 0.001) continue;
    vec2 dv = (uv - tp) * vec2(sa, 1.0);
    float dist = length(dv);
    float infl = exp(-dist * dist * 26.0) * life;
    vec2 dir = dist > 0.0001 ? dv / dist : vec2(0.0);
    vec2 tang = vec2(-dir.y, dir.x);            // касательная — закрутка
    push += (dir * 0.055 + tang * 0.045) * infl;
    near = max(near, infl);
  }
  uv += push;

  float v = 1.0 - texture2D(u_tex, clamp(uv, 0.0, 1.0)).r;
  v = clamp((v - 0.30) * 1.15, 0.0, 1.0);

  // Под курсором краска проступает гуще — след видно даже там, где её мало.
  float dens = clamp(v + near * 0.30, 0.0, 1.0);
  float hot  = pow(clamp((v - 0.70) * 3.0, 0.0, 1.0), 1.4);

  /* Полутоновый растр. Диаметр точки — от плотности. Ячейка чуть дышит от
     размешивания: при резком движении мышью растр становится крупнее, и
     движение читается даже на неподвижном участке. */
  float ang = 0.3927;
  vec2 rot = vec2(frag.x * cos(ang) - frag.y * sin(ang),
                  frag.x * sin(ang) + frag.y * cos(ang));
  float cell = 5.0 + u_stir * 1.6;
  vec2 g = fract(rot / cell) - 0.5;
  float dotR = length(g) * 2.0;
  float tone = 1.0 - smoothstep(dens * 1.30 - 0.10, dens * 1.30 + 0.10, dotR);

  vec2 off = sc - vec2(0.72, 0.46);
  off.x *= 0.9;
  float vig = 1.0 - smoothstep(0.10, 0.62, length(off));
  vig = clamp(vig + near * 0.5, 0.0, 1.0);   // след виден и вне пятна

  vec3 col = mix(u_bg, u_ink, tone * 0.46 * vig);
  col = mix(col, u_hot, hot * tone * 0.22 * vig);
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
      scroll: gl.getUniformLocation(prog, 'u_scroll'),
      trail: gl.getUniformLocation(prog, 'u_trail'),
      stir: gl.getUniformLocation(prog, 'u_stir'),
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

    /* След указателя.
     *
     * Десять последних положений с затухающей свежестью. Раньше здесь была
     * одна точка и смещение в 0.16 от неё — за курсором не следовало
     * ничего. Теперь мышь оставляет за собой полосу размешанной краски,
     * которая гаснет за пару секунд.
     *
     * Точка ставится не на каждое движение, а не чаще чем раз в 40 мс и
     * только если указатель заметно сместился: иначе при медленном ведении
     * все десять слотов забиваются почти одинаковыми координатами и след
     * вырождается в пятно. */
    const TRAIL = 10
    const trail = new Float32Array(TRAIL * 3)
    let lastPush = 0
    let lastX = 0.5, lastY = 0.55
    let stir = 0

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = 1 - (e.clientY - r.top) / r.height
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) return

      const dx = x - lastX, dy = y - lastY
      const moved = Math.hypot(dx, dy)
      // Энергия размешивания: копится от скорости, гаснет сама.
      stir = Math.min(1, stir + moved * 3.4)

      const now = performance.now()
      if (now - lastPush < 40 || moved < 0.004) return
      lastPush = now
      lastX = x
      lastY = y
      // Сдвигаем слоты и кладём новую точку первой.
      trail.copyWithin(3, 0, (TRAIL - 1) * 3)
      trail[0] = x
      trail[1] = y
      trail[2] = 1
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

      // Свежесть каждой точки падает со временем, энергия размешивания — тоже.
      for (let i = 0; i < TRAIL; i++) {
        const k = i * 3 + 2
        if (trail[k] > 0) trail[k] = Math.max(0, trail[k] - 0.016)
      }
      stir *= 0.94

      // Прогресс берём с героя, если его ведёт GSAP; иначе от положения
      // страницы.
      const attr = canvas.closest('[data-hero]')?.getAttribute('data-progress')
      const p = attr !== null && attr !== undefined
        ? Number(attr)
        : Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      const scrollP = Number.isFinite(p) ? p : 0

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(U.tex, 0)
      gl.uniform2f(U.texRes, texW, texH)
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform1f(U.time, (performance.now() - start) / 1000)
      gl.uniform3fv(U.trail, trail)
      gl.uniform1f(U.stir, stir)
      gl.uniform1f(U.scroll, scrollP)
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
