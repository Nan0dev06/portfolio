import { profile, projects } from './data'

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
