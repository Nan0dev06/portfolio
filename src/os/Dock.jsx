import { useOS } from './osStore'
import { ICONS } from './icons.jsx'

// Same kinds as the desktop icons so the artwork matches everywhere.
// github / linkedin are link shortcuts — their URLs live with the desktop
// icons in osStore, so the dock and the desktop can't drift apart.
const APPS = [
  { id: 'terminal', label: 'terminal', kind: 'terminal' },
  { id: 'paint', label: 'paint', kind: 'paint' },
  { id: 'projects', label: 'projects', kind: 'folder' },
  { id: 'contact', label: 'contact', kind: 'envelope' },
  { id: 'github', label: 'github', kind: 'github' },
  { id: 'linkedin', label: 'linkedin', kind: 'linkedin' },
]

export default function Dock() {
  const windows = useOS((s) => s.windows)
  const icons = useOS((s) => s.icons)
  const toggleWindow = useOS((s) => s.toggleWindow)

  const openTarget = (id) => {
    const link = icons[id]?.link
    if (link) return window.open(link, '_blank', 'noopener')
    toggleWindow(id)
  }

  return (
    <div className="dock">
      {APPS.map((app) => {
        const Glyph = ICONS[app.kind]
        return (
          <button key={app.id} className="dock-item" title={app.label} onClick={() => openTarget(app.id)}>
            <span className="dock-glyph">
              <Glyph />
            </span>
            <span className="dock-label">{app.label}</span>
            {windows[app.id]?.open && <span className="dock-dot" />}
          </button>
        )
      })}
    </div>
  )
}
