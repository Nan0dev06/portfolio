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
  const { closeWindow, minimizeWindow, focusWindow, moveWindow } = useOS.getState()
  const drag = useRef(null)
  const hideTimer = useRef(null)
  // 'close' | 'minimize' | null — which exit animation (if any) is playing
  const [hiding, setHiding] = useState(null)
  const [maximized, setMaximized] = useState(false)

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  const visible = win.open && !win.minimized
  if (!visible && !hiding) return null

  // close/minimize both play the same shrink-out animation, then apply the
  // real state change on a timer (no animationend dependency — that stalls
  // when the tab is backgrounded and leaves windows stuck on screen)
  const beginHide = (mode) => {
    if (hiding) return
    setHiding(mode)
    hideTimer.current = setTimeout(() => {
      setHiding(null)
      if (mode === 'close') closeWindow(id)
      else minimizeWindow(id)
    }, 190)
  }

  const onTitlePointerDown = (e) => {
    if (maximized) return // dragging a maximized window doesn't make sense
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
      className={`window ${hiding ? 'closing' : 'opening'} ${maximized ? 'maximized' : ''}`}
      style={{ zIndex: win.z, ...(maximized ? {} : { left: win.x, top: win.y, width }) }}
      onPointerDown={() => focusWindow(id)}
    >
      <div
        className="window-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        <div className="win-controls">
          <Star color="red" title={`close ${title}`} onClick={() => beginHide('close')} />
          <Star color="yellow" title="minimize" onClick={() => beginHide('minimize')} />
          <Star
            color="green"
            title={maximized ? 'restore' : 'zoom'}
            onClick={() => setMaximized((v) => !v)}
          />
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
