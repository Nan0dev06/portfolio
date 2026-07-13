import { useState } from 'react'
import { profile, projects } from './data'
import { useOS } from './osStore'
import PdfThumb from './PdfThumb.jsx'

export function About() {
  return (
    <div className="app-about">
      <div className="avatar">
        {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>🙂</span>}
      </div>
      <h2>
        {profile.name} <small>· {profile.title}</small>
      </h2>
      {profile.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

export function Projects() {
  return (
    <div className="app-projects">
      {projects.map((p) => (
        <div key={p.name} className="project-card">
          <div className="project-head">
            <b>{p.name}</b>
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer">
                open ↗
              </a>
            )}
          </div>
          <p>{p.desc}</p>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Resume() {
  const setContentAspect = useOS((s) => s.setContentAspect)
  return (
    <div className="app-resume">
      {profile.resumeUrl ? (
        <>
          <PdfThumb url={profile.resumeUrl} onAspectRatio={(r) => setContentAspect('resume', r)} />
          <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer" download>
            download resume.pdf
          </a>
        </>
      ) : (
        <p className="muted">
          (placeholder — drop <code>resume.pdf</code> into <code>/public</code> and set{' '}
          <code>resumeUrl</code> in <code>src/os/data.js</code>)
        </p>
      )}
    </div>
  )
}

export function Contact() {
  return (
    <div className="app-contact">
      <p>want to reach me?</p>
      <a className="btn" href={`mailto:${profile.email}`}>
        ✉️ {profile.email}
      </a>
      <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
        github ↗
      </a>
    </div>
  )
}

export function Guestbook() {
  // local-only for now — will be wired to Supabase later
  const [entries, setEntries] = useState([
    { name: 'nano', msg: 'welcome to my guestbook — leave a note :)' },
  ])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const sign = (e) => {
    e.preventDefault()
    if (!msg.trim()) return
    setEntries((prev) => [...prev, { name: name.trim() || 'anonymous', msg: msg.trim() }])
    setMsg('')
  }

  return (
    <div className="app-guestbook">
      <div className="gb-entries">
        {entries.map((en, i) => (
          <p key={i}>
            <b>{en.name}</b> — {en.msg}
          </p>
        ))}
      </div>
      <form onSubmit={sign} className="gb-form">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" maxLength={30} />
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="say something nice…" maxLength={140} />
        <button type="submit" className="btn">
          sign
        </button>
      </form>
      <p className="muted">entries are stored locally for now — real guestbook coming soon.</p>
    </div>
  )
}
