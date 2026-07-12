import { useRef, useState } from 'react'
import { useOS } from './osStore'
import { languages } from './data'
import { ICONS } from './icons.jsx'

// draggable desktop icon that opens its target on a click (not a drag)
function Icon({ id, icon, active, onOpen }) {
  const moveIcon = useOS((s) => s.moveIcon)
  const drag = useRef(null)
  const Glyph = ICONS[icon.kind] || ICONS.file

  const onPointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events may lack a live pointer */
    }
    drag.current = { sx: e.clientX, sy: e.clientY, bx: icon.x, by: icon.y, moved: false }
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.sx
    const dy = e.clientY - drag.current.sy
    if (!drag.current.moved && Math.hypot(dx, dy) < 5) return
    drag.current.moved = true
    moveIcon(id, Math.max(0, drag.current.bx + dx), Math.max(28, drag.current.by + dy))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onOpen()
    drag.current = null
  }

  return (
    <button
      className={`desk-icon ${active ? 'active' : ''}`}
      style={{ left: icon.x, top: icon.y }}
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
  const openWindow = useOS((s) => s.openWindow)
  const [spilled, setSpilled] = useState(false)

  // scattered destinations for the language chips (offset from the folder)
  const scatter = languages.map((_, i) => {
    const seed = i * 97.13
    const dx = (Math.sin(seed) * 0.5 + 0.5) * 520 - 120
    const dy = (Math.cos(seed * 1.7) * 0.5 + 0.5) * 360 - 40
    const rot = Math.sin(seed * 3.1) * 24
    return { dx, dy, rot }
  })

  const openTarget = (id, icon) => {
    if (id === 'languages') return setSpilled((v) => !v)
    if (icon.link) return window.open(icon.link, '_blank', 'noopener')
    openWindow(id)
  }

  const lang = icons.languages

  return (
    <div className="desktop-icons">
      {Object.entries(icons)
        .filter(([id]) => id !== 'languages')
        .map(([id, icon]) => (
          <Icon key={id} id={id} icon={icon} active={windows[id]?.open} onOpen={() => openTarget(id, icon)} />
        ))}

      {/* languages folder — chips fly out and scatter, click again to recall */}
      <Icon id="languages" icon={lang} active={spilled} onOpen={() => openTarget('languages', lang)} />
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
