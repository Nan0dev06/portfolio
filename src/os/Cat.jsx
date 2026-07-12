import { useEffect, useRef } from 'react'

// ─── pixel-art frames ─────────────────────────────────────────────────────────
// 16x14 grids, cat faces RIGHT (flipped in CSS when running left).
// legend: . transparent  k outline  o orange  w cream  e eye  z zzz
const PALETTE = { k: '#2b2320', o: '#e8963f', w: '#f6efe4', e: '#2b2320', z: '#9a8d82' }

const RUN_A = [
  '................',
  '..........k...k.',
  '.........kkkkkkk',
  '.........koeoeok',
  '.kk......koowwok',
  '..kk.....kooook.',
  '...kkkkkkkooook.',
  '..koooooooooook.',
  '..koooooooooook.',
  '..kooooooooook..',
  '...kok....kok...',
  '...kk......kk...',
  '................',
  '................',
]

const RUN_B = [
  '................',
  '..........k...k.',
  '.........kkkkkkk',
  '.........koeoeok',
  '.kk......koowwok',
  '..kk.....kooook.',
  '...kkkkkkkooook.',
  '..koooooooooook.',
  '..koooooooooook.',
  '..kooooooooook..',
  '....kok..kok....',
  '....kk....kk....',
  '................',
  '................',
]

const SIT = [
  '................',
  '........k...k...',
  '.......kkkkkkk..',
  '.......koeoeok..',
  '.......koowook..',
  '........koook...',
  '.......koooook..',
  '......koooooook.',
  '......koooooook.',
  '......koooooookk',
  '......kooooook.k',
  '.......kkkkkkkk.',
  '................',
  '................',
]

const SIT_BLINK = SIT.map((row, i) => (i === 3 ? '.......koooook..' : row))

const SLEEP_A = [
  '................',
  '............z...',
  '..........z.....',
  '................',
  '.....kkkkkk.....',
  '....kooooook....',
  '...koooooooook..',
  '...koooooooook..',
  '...koooooooook..',
  '....kkkkkkkkkk..',
  '................',
  '................',
  '................',
  '................',
]

const SLEEP_B = SLEEP_A.map((row, i) =>
  i === 1 ? '..........z.....' : i === 2 ? '............z...' : row,
)

const SCALE = 4
const W = 16 * SCALE
const H = 14 * SCALE

function drawFrame(ctx, frame) {
  ctx.clearRect(0, 0, W, H)
  for (let y = 0; y < frame.length; y++) {
    for (let x = 0; x < frame[y].length; x++) {
      const c = PALETTE[frame[y][x]]
      if (!c) continue
      ctx.fillStyle = c
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    }
  }
}

// ─── the pet ──────────────────────────────────────────────────────────────────
// chases the cursor; sits when it catches it; falls asleep when you go quiet.
export default function Cat() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const pos = { x: window.innerWidth / 2 - 100, y: window.innerHeight - 160 }
    const target = { x: pos.x, y: pos.y }
    let lastMouse = performance.now()
    let facing = 1 // 1 = right, -1 = left
    let raf

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      lastMouse = performance.now()
    }
    window.addEventListener('pointermove', onMove)

    let prev = performance.now()
    let lastDrawn = null

    const loop = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now

      // aim just below-left of the cursor so the cat doesn't cover it
      const dx = target.x - 26 - pos.x
      const dy = target.y + 14 - pos.y
      const dist = Math.hypot(dx, dy)
      const idleFor = now - lastMouse

      let frame
      if (idleFor > 12000) {
        frame = Math.floor(now / 700) % 2 ? SLEEP_A : SLEEP_B
      } else if (dist > 36) {
        const speed = Math.min(260, 90 + dist * 1.4)
        pos.x += (dx / dist) * speed * dt
        pos.y += (dy / dist) * speed * dt
        if (Math.abs(dx) > 4) facing = dx > 0 ? 1 : -1
        frame = Math.floor(now / 130) % 2 ? RUN_A : RUN_B
      } else {
        // sitting: blink every ~3s
        frame = now % 3000 < 180 ? SIT_BLINK : SIT
      }

      if (frame !== lastDrawn) {
        drawFrame(ctx, frame)
        lastDrawn = frame
      }
      canvas.style.transform = `translate3d(${pos.x - W / 2}px, ${pos.y - H}px, 0) scaleX(${facing})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} width={W} height={H} className="cat" aria-hidden="true" />
}
