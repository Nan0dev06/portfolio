import { useOS } from './osStore'

const APPS = [
  { id: 'about', label: 'about me', glyph: '🙂' },
  { id: 'projects', label: 'projects', glyph: '🛠️' },
  { id: 'resume', label: 'resume', glyph: '📄' },
  { id: 'contact', label: 'contact', glyph: '✉️' },
  { id: 'guestbook', label: 'guestbook', glyph: '✍️' },
]

export default function Dock() {
  const windows = useOS((s) => s.windows)
  const openWindow = useOS((s) => s.openWindow)

  return (
    <div className="dock">
      {APPS.map((app) => (
        <button
          key={app.id}
          className="dock-item"
          title={app.label}
          onClick={() => openWindow(app.id)}
        >
          <span className="dock-glyph">{app.glyph}</span>
          <span className="dock-label">{app.label}</span>
          {windows[app.id].open && <span className="dock-dot" />}
        </button>
      ))}
    </div>
  )
}
