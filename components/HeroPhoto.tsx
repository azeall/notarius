'use client'
import { useEffect, useRef } from 'react'

/**
 * Первый экран: фотография, прогнанная через полутоновый растр.
 *
 * Чем это заменило кляксу. Раньше здесь клубилась абстрактная краска. Она
 * была случайной — а случайное пятно ничего не значит и потому читается
 * мусором, сколько его ни оживляй течением. Заменено на предмет: рука с
 * пером над бумагой. Проще по устройству и осмысленнее по содержанию — это
 * ровно то, зачем к нотариусу и приходят.
 *
 * Растр остался: он и даёт «отпечатанный» вид, из-за которого фотография
 * перестаёт быть стоковой картинкой и становится частью оформления. Точка
 * тем крупнее, чем темнее место снимка; сетка повёрнута на 22.5°, как в
 * типографской печати.
 *
 * Движение намеренно скупое. Кадр медленно наплывает при прокрутке, а под
 * курсором растр мельчает — снимок в этом месте становится отчётливее, как
 * будто присматриваешься. Никаких завихрений: предмет не должен плыть, иначе
 * он перестанет быть предметом.
 *
 * На телефонах и при prefers-reduced-motion не запускается: там остаётся
 * та же фотография обычной картинкой через CSS, без растра и без кадра.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2      u_res;
uniform float     u_scroll;
uniform vec2      u_ptr;      // сглаженное положение курсора, 0..1
uniform float     u_ptrOn;    // 0..1 — курсор над экраном
uniform vec3      u_bg;
uniform vec3      u_ink;
uniform sampler2D u_tex;
uniform vec2      u_texRes;

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 sc = frag / u_res;

  // Кадрирование «cover» — снимок закрывает экран без растяжения.
  float sa = u_res.x / u_res.y;
  float ta = u_texRes.x / u_texRes.y;
  vec2 uv = sc;
  if (sa > ta) uv.y = (uv.y - 0.5) * (ta / sa) + 0.5;
  else         uv.x = (uv.x - 0.5) * (sa / ta) + 0.5;

  // Медленный наплыв при прокрутке.
  uv = (uv - vec2(0.5, 0.42)) * (1.0 - u_scroll * 0.10) + vec2(0.5, 0.42);
  uv.y += u_scroll * 0.05;

  float lum = texture2D(u_tex, clamp(uv, 0.0, 1.0)).r;
  float dens = clamp((1.0 - lum - 0.06) * 1.25, 0.0, 1.0);

  /* Шаг растра. Под курсором сетка мельчает, и снимок в этом месте
     становится отчётливее — единственная реакция на указатель. Предмет при
     этом остаётся на месте: рука с пером не должна плыть. */
  vec2 d = (sc - u_ptr) * vec2(sa, 1.0);
  float near = exp(-dot(d, d) * 9.0) * u_ptrOn;
  float cell = mix(6.4, 2.6, near);

  float ang = 0.3927;
  vec2 rot = vec2(frag.x * cos(ang) - frag.y * sin(ang),
                  frag.x * sin(ang) + frag.y * cos(ang));
  vec2 g = fract(rot / cell) - 0.5;
  float dotR = length(g) * 2.0;
  float tone = 1.0 - smoothstep(dens * 1.30 - 0.10, dens * 1.30 + 0.10, dotR);

  // Слева стоит текст — туда снимок не пускаем.
  float fade = smoothstep(0.24, 0.62, sc.x);
  fade *= 1.0 - smoothstep(0.72, 1.0, sc.y);

  vec3 col = mix(u_bg, u_ink, tone * 0.92 * fade);
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null }
  return sh
}

function token(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const p = raw.split(/\s+/).map(Number)
  return p.length === 3 && p.every(n => !Number.isNaN(n))
    ? [p[0] / 255, p[1] / 255, p[2] / 255]
    : fallback
}

export default function HeroPhoto() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

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
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
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
      scroll: gl.getUniformLocation(prog, 'u_scroll'),
      ptr: gl.getUniformLocation(prog, 'u_ptr'),
      ptrOn: gl.getUniformLocation(prog, 'u_ptrOn'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      ink: gl.getUniformLocation(prog, 'u_ink'),
    }

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
    img.src = '/ph-sign.jpg'
    img.onload = () => {
      if (disposed) return
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      texW = img.naturalWidth
      texH = img.naturalHeight
      // Снимок пришёл — прячем запасную картинку под холстом.
      canvas.parentElement?.setAttribute('data-gl', 'on')
    }

    let bg = token('--bg-rgb', [0.95, 0.94, 0.91])
    let ink = token('--text-rgb', [0.1, 0.09, 0.13])
    const themeWatch = new MutationObserver(() => {
      bg = token('--bg-rgb', bg)
      ink = token('--text-rgb', ink)
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const resize = () => {
      const w = Math.max(1, canvas.clientWidth)
      const h = Math.max(1, canvas.clientHeight)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const ptr = { x: 0.75, y: 0.5, on: 0 }
    const smooth = { x: 0.75, y: 0.5, on: 0 }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      ptr.x = (e.clientX - r.left) / r.width
      ptr.y = 1 - (e.clientY - r.top) / r.height
      ptr.on = (ptr.x >= 0 && ptr.x <= 1 && ptr.y >= 0 && ptr.y <= 1) ? 1 : 0
    }
    const onLeave = () => { ptr.on = 0 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      resize()
      smooth.x += (ptr.x - smooth.x) * 0.10
      smooth.y += (ptr.y - smooth.y) * 0.10
      smooth.on += (ptr.on - smooth.on) * 0.06
      const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(U.tex, 0)
      gl.uniform2f(U.texRes, texW, texH)
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform1f(U.scroll, p)
      gl.uniform2f(U.ptr, smooth.x, smooth.y)
      gl.uniform1f(U.ptrOn, smooth.on)
      gl.uniform3f(U.bg, bg[0], bg[1], bg[2])
      gl.uniform3f(U.ink, ink[0], ink[1], ink[2])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
