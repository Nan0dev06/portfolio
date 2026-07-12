import { useEffect, useRef, useState } from 'react'
import { useOS } from './osStore'

function Star({ onClick, title, color }) {
  return (
    <button
      className={`star-btn ${color}`}
      title={title}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.8 5.9 20.3l1.3-6.7-5-4.6 6.8-.8z" />
      </svg>
    </button>
  )
}

export default function Window({ id, title, width = 460, children }) {
  const win = useOS((s) => s.windows[id])
  const { closeWindow, focusWindow, moveWindow } = useOS.getState()
  const drag = useRef(null)
  const closeTimer = useRef(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  if (!win.open && !closing) return null

  // close = play the exit animation, then unmount on a timer (no animationend
  // dependency — that stalls when the tab is backgrounded and left windows stuck)
  const beginClose = () => {
    if (closing) return
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      setClosing(false)
      closeWindow(id)
    }, 190)
  }

  const onTitlePointerDown = (e) => {
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events may lack a live pointer — dragging still works */
    }
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: win.x, baseY: win.y }
  }
  const onTitlePointerMove = (e) => {
    if (!drag.current) return
    const { startX, startY, baseX, baseY } = drag.current
    moveWindow(id, baseX + e.clientX - startX, Math.max(30, baseY + e.clientY - startY))
  }
  const onTitlePointerUp = () => (drag.current = null)

  return (
    <div
      className={`window ${closing ? 'closing' : 'opening'}`}
      style={{ left: win.x, top: win.y, zIndex: win.z, width }}
      onPointerDown={() => focusWindow(id)}
    >
      <div
        className="window-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        <div className="win-controls">
          <Star color="red" title={`close ${title}`} onClick={beginClose} />
          <Star color="yellow" title="minimize" onClick={() => {}} />
          <Star color="green" title="zoom" onClick={() => {}} />
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
