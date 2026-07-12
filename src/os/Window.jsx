import { useEffect, useRef, useState } from 'react'
import { useOS } from './osStore'

function Star({ onClick, title }) {
  return (
    <button className="star-btn" title={title} onPointerDown={(e) => e.stopPropagation()} onClick={onClick}>
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

  const finishClose = () => {
    clearTimeout(closeTimer.current)
    setClosing(false)
    closeWindow(id)
  }
  const beginClose = () => {
    setClosing(true)
    // fallback in case animationend never fires (e.g. backgrounded tab pauses the animation)
    closeTimer.current = setTimeout(finishClose, 280)
  }
  const onAnimEnd = () => {
    if (closing) finishClose()
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
      onAnimationEnd={onAnimEnd}
    >
      <div
        className="window-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        <span className="window-title">{title}</span>
        <div className="win-controls">
          <Star title="minimize" onClick={beginClose} />
          <Star title={`close ${title}`} onClick={beginClose} />
        </div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
