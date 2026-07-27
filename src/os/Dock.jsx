import { useOS } from './osStore'
import { ICONS } from './icons.jsx'

// Same kinds as the desktop icons so the artwork matches everywhere.
const APPS = [
  { id: 'terminal', label: 'terminal', kind: 'terminal' },
  { id: 'paint', label: 'paint', kind: 'paint' },
  { id: 'projects', label: 'projects', kind: 'folder' },
  { id: 'resume', label: 'resume', kind: 'file' },
  { id: 'contact', label: 'contact', kind: 'envelope' },
]

export default function Dock() {
  const windows = useOS((s) => s.windows)
  const toggleWindow = useOS((s) => s.toggleWindow)

  return (
    <div className="dock">
      {APPS.map((app) => {
        const Glyph = ICONS[app.kind]
        return (
          <button key={app.id} className="dock-item" title={app.label} onClick={() => toggleWindow(app.id)}>
            <span className="dock-glyph">
              <Glyph />
            </span>
            <span className="dock-label">{app.label}</span>
            {windows[app.id].open && <span className="dock-dot" />}
          </button>
        )
      })}
    </div>
  )
}
