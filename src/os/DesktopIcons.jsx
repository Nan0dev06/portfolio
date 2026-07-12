import { useState } from 'react'
import { useOS } from './osStore'
import { languages } from './data'

function FolderGlyph() {
  return (
    <svg viewBox="0 0 48 38" className="folder-svg">
      <path d="M2 8a4 4 0 0 1 4-4h12l4 5h20a4 4 0 0 1 4 4v21a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    </svg>
  )
}

export default function DesktopIcons() {
  const openWindow = useOS((s) => s.openWindow)
  const [spilled, setSpilled] = useState(false)

  return (
    <div className="desktop-icons">
      <button className="desk-icon" onDoubleClick={() => openWindow('about')} onClick={() => openWindow('about')}>
        <span className="desk-icon-img">📷</span>
        <span className="desk-icon-name">me.jpeg</span>
      </button>

      {/* languages folder — click to spill the language chips out */}
      <div className="folder-wrap">
        <button className="desk-icon" onClick={() => setSpilled((v) => !v)}>
          <span className={`desk-icon-img folder ${spilled ? 'open' : ''}`}>
            <FolderGlyph />
          </span>
          <span className="desk-icon-name">languages</span>
        </button>
        <div className={`spill ${spilled ? 'out' : ''}`}>
          {languages.map((lang, i) => {
            // fan the chips out to the left of the folder in a gentle arc
            const t = i / Math.max(1, languages.length - 1)
            const angle = (-150 + t * 120) * (Math.PI / 180)
            const r = 92 + (i % 2) * 34
            const x = Math.cos(angle) * r
            const y = Math.sin(angle) * r * 0.75
            return (
              <span
                key={lang.name}
                className="lang-chip"
                title={lang.name}
                style={{
                  '--tx': `${x}px`,
                  '--ty': `${y}px`,
                  transitionDelay: spilled ? `${i * 45}ms` : `${(languages.length - i) * 25}ms`,
                  background: lang.color,
                  color: lang.dark ? '#2b2320' : '#fff',
                }}
              >
                {lang.code}
              </span>
            )
          })}
        </div>
      </div>

      <button className="desk-icon" onClick={() => openWindow('resume')}>
        <span className="desk-icon-img">📄</span>
        <span className="desk-icon-name">resume.pdf</span>
      </button>
    </div>
  )
}
