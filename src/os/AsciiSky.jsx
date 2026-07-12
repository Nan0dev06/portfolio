import { useEffect, useRef } from 'react'

// Interactive ASCII sky: white ASCII clouds drifting over Y2K blue.
// Characters near the cursor get pushed around (ripple on hover).
const RAMP = [' ', ' ', '.', '·', ':', '*', 'o', 'O', '#', '@']
const CELL = 15

// cheap hashed value noise
function hash(ix, iy) {
  let h = ix * 374761393 + iy * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967295
}
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
function clouds(x, y, t) {
  return noise(x * 0.09 + t, y * 0.16) * 0.65 + noise(x * 0.22 + t * 1.7, y * 0.33 + 40) * 0.35
}

export default function AsciiSky() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const mouse = { x: -9999, y: -9999 }
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)

    const draw = (now) => {
      const t = now * 0.0012
      const W = canvas.width, H = canvas.height
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#2e63d8')
      g.addColorStop(0.6, '#4a8de6')
      g.addColorStop(1, '#7ab6f0')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      ctx.font = `bold ${CELL}px "Cascadia Code", Consolas, monospace`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      const R = 130 // hover influence radius
      for (let gy = 0; gy < H / CELL + 1; gy++) {
        for (let gx = 0; gx < W / CELL + 1; gx++) {
          const v = clouds(gx, gy, t)
          const level = Math.floor((v - 0.29) * 34)
          if (level < 1) continue
          const ch = RAMP[Math.min(RAMP.length - 1, level)]
          let x = gx * CELL
          let y = gy * CELL
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < R) {
            const f = (1 - d / R) ** 2 * 22
            x += (dx / (d || 1)) * f
            y += (dy / (d || 1)) * f
          }
          const alpha = Math.min(0.95, 0.35 + level * 0.09)
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.fillText(ch, x, y)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="ascii-sky" aria-hidden="true" />
}
