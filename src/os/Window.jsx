import { useEffect, useRef, useState } from 'react'
import { useOS } from './osStore'
import { useViewport, clamp } from './useViewport'

// same safe-area the CSS .maximized rule uses (menu bar / dock clearance)
const DESKTOP_MARGIN = { left: 16, top: 40, right: 16, bottom: 96 }
// rough non-content chrome inside a window: titlebar + body padding, plus
// (for content like a PDF preview) room for a caption/button below it. Kept
// generous on purpose — undershooting leaves a small gap, but overshooting
// makes the content overflow into a scrollbar, which shrinks the available
// width and re-triggers the resize observer in a feedback loop.
const CHROME = { w: 48, h: 170 }

// largest box matching `aspect` (height/width) that fits the desktop's safe
// area once CHROME is subtracted — so maximizing hugs the actual content
// (e.g. a PDF page) instead of stretching a generic rectangle around it.
function fitToContent(aspect) {
  const availW = window.innerWidth - DESKTOP_MARGIN.left - DESKTOP_MARGIN.right
  const availH = window.innerHeight - DESKTOP_MARGIN.top - DESKTOP_MARGIN.bottom
  const contentAvailW = availW - CHROME.w
  const contentAvailH = availH - CHROME.h

  let contentW, contentH
  if (contentAvailH / contentAvailW > aspect) {
    contentW = contentAvailW
    contentH = contentW * aspect
  } else {
    contentH = contentAvailH
    contentW = contentH / aspect
  }

  const w = contentW + CHROME.w
  const h = contentH + CHROME.h
  return {
    left: DESKTOP_MARGIN.left + (availW - w) / 2,
    top: DESKTOP_MARGIN.top + (availH - h) / 2,
    width: w,
    height: h,
  }
}

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
  const { vw, vh } = useViewport()
  // never wider than the screen, never positioned off it (small viewports)
  const winWidth = Math.min(width, vw - 16)
  const winLeft = clamp(win.x, 8, vw - winWidth - 8)
  const winTop = clamp(win.y, 30, vh - 140)
  const drag = useRef(null)
  const hideTimer = useRef(null)
  // 'close' | 'minimize' | null — which exit animation (if any) is playing
  const [hiding, setHiding] = useState(null)
  const [maximized, setMaximized] = useState(false)
  const [fitRect, setFitRect] = useState(null)

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  // when maximizing content with a known aspect ratio (e.g. a PDF page),
  // hug that shape instead of using the generic full-rect .maximized CSS
  useEffect(() => {
    if (!maximized || !win.contentAspect) {
      setFitRect(null)
      return
    }
    const update = () => setFitRect(fitToContent(win.contentAspect))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [maximized, win.contentAspect])

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

  return (
    <div
      className={`window ${hiding ? 'closing' : 'opening'} ${maximized ? 'maximized' : ''}`}
      style={{
        zIndex: win.z,
        ...(maximized ? fitRect || {} : { left: winLeft, top: winTop, width: winWidth }),
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
