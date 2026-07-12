import { useEffect, useRef, useState } from 'react'
import { profile } from './data'

const SWATCHES = ['#0a0e2a', '#2530ff', '#4b8bff', '#00e5ff', '#ff3ea5', '#ffd23e', '#39ff88', '#ffffff']
const SIZES = [2, 5, 10]

// About Me, styled as a Y2K paint program. Real drawable canvas + undo (no eraser).
export default function Paint() {
  const canvasRef = useRef(null)
  const strokes = useRef([])
  const cur = useRef(null)
  const [color, setColor] = useState('#2530ff')
  const [size, setSize] = useState(5)
  const [, force] = useState(0)

  const redraw = () => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const st of strokes.current) {
      ctx.strokeStyle = st.color
      ctx.lineWidth = st.size
      ctx.beginPath()
      st.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
      ctx.stroke()
    }
  }

  useEffect(redraw, [])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const down = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events may lack a live pointer */
    }
    cur.current = { color, size, points: [pos(e)] }
    strokes.current.push(cur.current)
  }
  const move = (e) => {
    if (!cur.current) return
    cur.current.points.push(pos(e))
    redraw()
  }
  const up = () => (cur.current = null)
  const undo = () => {
    strokes.current.pop()
    redraw()
    force((n) => n + 1)
  }

  return (
    <div className="paint">
      <div className="paint-menu">
        {['File', 'Edit', 'View', 'Help'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="paint-about">
        <b>{profile.name}</b> — {profile.title}
        <p>{profile.about?.[0]}</p>
      </div>

      <div className="paint-stage">
        <div className="paint-tools">
          <div className="swatches">
            {SWATCHES.map((c) => (
              <button
                key={c}
                className={`swatch ${c === color ? 'sel' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
          <div className="sizes">
            {SIZES.map((sz) => (
              <button key={sz} className={`size ${sz === size ? 'sel' : ''}`} onClick={() => setSize(sz)}>
                <span style={{ width: sz + 4, height: sz + 4 }} />
              </button>
            ))}
          </div>
          <button className="paint-undo" onClick={undo}>
            ↶ undo
          </button>
        </div>

        <div className="paint-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={300}
            height={210}
            className="paint-canvas"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
          />
          <span className="paint-hint">draw something ✎</span>
        </div>
      </div>
    </div>
  )
}
