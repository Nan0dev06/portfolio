import { useRef } from 'react'
import { useOS } from './osStore'

export default function Window({ id, title, width = 460, children }) {
  const win = useOS((s) => s.windows[id])
  const { closeWindow, focusWindow, moveWindow } = useOS.getState()
  const drag = useRef(null)

  if (!win.open) return null

  const onTitlePointerDown = (e) => {
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer may already be gone (e.g. synthetic events) — dragging still works */
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
      className="window"
      style={{ left: win.x, top: win.y, zIndex: win.z, width }}
      onPointerDown={() => focusWindow(id)}
    >
      <div
        className="window-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        <div className="traffic">
          <button
            className="light red"
            aria-label={`close ${title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(id)}
          />
          <span className="light yellow" />
          <span className="light green" />
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
