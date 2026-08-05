import { useEffect, useRef, useState } from 'react'
import { useOS } from './osStore'
import { useViewport, clamp } from './useViewport'

function Dot({ onClick, title, color }) {
  return (
    <button
      className={`win-btn ${color}`}
      title={title}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
    />
  )
}

// drag targets around the frame, like a normal window manager
const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

export default function Window({
  id,
  title,
  width = 460,
  height,
  minWidth = 260,
  minHeight = 160,
  bare = false,
  children,
}) {
  const win = useOS((s) => s.windows[id])
  const { closeWindow, minimizeWindow, focusWindow, moveWindow, resizeWindow } = useOS.getState()
  const { vw, vh } = useViewport()
  // never wider than the screen, never positioned off it (small viewports)
  const winWidth = Math.min(win.w ?? width, vw - 16)
  // a `height` default gives the app a real frame to fill; without one the
  // window keeps the old behaviour of sizing itself to its content
  const winHeight = win.h ?? (height && Math.min(height, vh - 120))
  const winLeft = clamp(win.x, 8, vw - winWidth - 8)
  const winTop = clamp(win.y, 30, vh - 140)
  const drag = useRef(null)
  const resize = useRef(null)
  const frame = useRef(null)
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
    // base off the clamped (rendered) position so the first drag doesn't jump
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: winLeft, baseY: winTop }
  }
  const onTitlePointerMove = (e) => {
    if (!drag.current) return
    const { startX, startY, baseX, baseY } = drag.current
    moveWindow(
      id,
      clamp(baseX + e.clientX - startX, 8, window.innerWidth - winWidth - 8),
      clamp(baseY + e.clientY - startY, 30, window.innerHeight - 140)
    )
  }
  const onTitlePointerUp = () => (drag.current = null)

  // Resizing measures the live frame rather than trusting stored w/h, so the
  // first drag on a never-resized window starts from its real content size.
  const startResize = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events may lack a live pointer */
    }
    const el = frame.current
    resize.current = {
      dir,
      sx: e.clientX,
      sy: e.clientY,
      bw: el.offsetWidth,
      bh: el.offsetHeight,
      bx: winLeft,
      by: winTop,
    }
  }
  const onResizeMove = (e) => {
    const r = resize.current
    if (!r) return
    const dx = e.clientX - r.sx
    const dy = e.clientY - r.sy
    const maxW = vw - 16
    const maxH = vh - 48
    let [w, h, x, y] = [r.bw, r.bh, r.bx, r.by]
    if (r.dir.includes('e')) w = clamp(r.bw + dx, minWidth, maxW)
    if (r.dir.includes('s')) h = clamp(r.bh + dy, minHeight, maxH)
    // dragging a top/left edge moves the opposite corner instead: clamp the
    // size first, then derive the origin from it so the far edge stays put
    if (r.dir.includes('w')) {
      w = clamp(r.bw - dx, minWidth, maxW)
      x = r.bx + r.bw - w
    }
    if (r.dir.includes('n')) {
      h = clamp(r.bh - dy, minHeight, maxH)
      y = r.by + r.bh - h
    }
    resizeWindow(id, w, h)
    if (x !== r.bx || y !== r.by) moveWindow(id, x, y)
  }
  const endResize = () => (resize.current = null)

  return (
    <div
      ref={frame}
      className={`window ${hiding ? 'closing' : 'opening'} ${maximized ? 'maximized' : ''} ${
        winHeight && !maximized ? 'sized' : ''
      }`}
      style={{
        zIndex: win.z,
        ...(maximized ? {} : { left: winLeft, top: winTop, width: winWidth, height: winHeight }),
      }}
      onPointerDown={() => focusWindow(id)}
    >
      <div
        className="window-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        <div className="win-controls">
          <Dot color="red" title={`close ${title}`} onClick={() => beginHide('close')} />
          <Dot color="yellow" title="minimize" onClick={() => beginHide('minimize')} />
          <Dot
            color="green"
            title={maximized ? 'restore' : 'zoom'}
            onClick={() => setMaximized((v) => !v)}
          />
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className={`window-body ${bare ? 'bare' : ''}`}>{children}</div>

      {/* a maximized window fills the desktop, so there's nothing to drag */}
      {!maximized &&
        HANDLES.map((dir) => (
          <span
            key={dir}
            className={`win-resize ${dir}`}
            onPointerDown={startResize(dir)}
            onPointerMove={onResizeMove}
            onPointerUp={endResize}
          />
        ))}
    </div>
  )
}
