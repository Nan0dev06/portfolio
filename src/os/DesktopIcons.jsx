import { useRef, useState } from 'react'
import { useOS } from './osStore'
import { languages } from './data'
import { ICONS } from './icons.jsx'
import { useViewport, clamp } from './useViewport'

// keep an icon fully on screen (90px wide, ~110px tall incl. label; 28px menubar)
const iconBounds = (vw, vh) => ({ maxX: vw - 94, maxY: vh - 118 })

// draggable desktop icon that opens its target on a click (not a drag)
function Icon({ id, icon, active, onOpen, vw, vh }) {
  const moveIcon = useOS((s) => s.moveIcon)
  const drag = useRef(null)
  const Glyph = ICONS[icon.kind] || ICONS.file
  const { maxX, maxY } = iconBounds(vw, vh)

  const onPointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events may lack a live pointer */
    }
    // base off the clamped (rendered) position so the first drag doesn't jump
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      bx: clamp(icon.x, 0, maxX),
      by: clamp(icon.y, 28, maxY),
      moved: false,
    }
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.sx
    const dy = e.clientY - drag.current.sy
    if (!drag.current.moved && Math.hypot(dx, dy) < 5) return
    drag.current.moved = true
    moveIcon(id, clamp(drag.current.bx + dx, 0, maxX), clamp(drag.current.by + dy, 28, maxY))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onOpen()
    drag.current = null
  }

  return (
    <button
      className={`desk-icon ${active ? 'active' : ''}`}
      style={{ left: clamp(icon.x, 0, maxX), top: clamp(icon.y, 28, maxY) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <span className="desk-icon-img">
        <Glyph />
      </span>
      <span className="desk-icon-name">{icon.label}</span>
    </button>
  )
}

export default function DesktopIcons() {
  const icons = useOS((s) => s.icons)
  const windows = useOS((s) => s.windows)
  const toggleWindow = useOS((s) => s.toggleWindow)
  const [spilled, setSpilled] = useState(false)
  const { vw, vh } = useViewport()

  const lang = icons.languages

  // scattered destinations for the language chips (offset from the folder),
  // clamped so every chip lands on screen even on small viewports
  const scatter = languages.map((_, i) => {
    const seed = i * 97.13
    const dx = (Math.sin(seed) * 0.5 + 0.5) * 520 - 120
    const dy = (Math.cos(seed * 1.7) * 0.5 + 0.5) * 360 - 40
    const rot = Math.sin(seed * 3.1) * 24
    return {
      dx: clamp(dx, 8 - (lang.x + 12), vw - 52 - (lang.x + 12)),
      dy: clamp(dy, 34 - (lang.y + 10), vh - 58 - (lang.y + 10)),
      rot,
    }
  })

  const openTarget = (id, icon) => {
    if (id === 'languages') return setSpilled((v) => !v)
    if (icon.link) return window.open(icon.link, '_blank', 'noopener')
    toggleWindow(id)
  }

  return (
    <div className="desktop-icons">
      {Object.entries(icons)
        .filter(([id]) => id !== 'languages')
        .map(([id, icon]) => (
          <Icon
            key={id}
            id={id}
            icon={icon}
            vw={vw}
            vh={vh}
            active={windows[id]?.open && !windows[id]?.minimized}
            onOpen={() => openTarget(id, icon)}
          />
        ))}

      {/* languages folder — chips fly out and scatter, click again to recall */}
      <Icon
        id="languages"
        icon={lang}
        vw={vw}
        vh={vh}
        active={spilled}
        onOpen={() => openTarget('languages', lang)}
      />
      {languages.map((l, i) => (
        <span
          key={l.name}
          className={`lang-chip ${spilled ? 'out' : ''}`}
          title={l.name}
          style={{
            left: lang.x + 12,
            top: lang.y + 10,
            '--dx': `${scatter[i].dx}px`,
            '--dy': `${scatter[i].dy}px`,
            '--rot': `${scatter[i].rot}deg`,
            transitionDelay: `${(spilled ? i : languages.length - i) * 40}ms`,
            background: l.color,
            color: l.dark ? '#0a0e2a' : '#fff',
          }}
        >
          {l.code}
        </span>
      ))}
    </div>
  )
}
