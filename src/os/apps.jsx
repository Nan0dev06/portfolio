import { profile, projects, tagline } from './data'

export function Projects() {
  return (
    <div className="app-projects">
      <p className="projects-tagline">{tagline}</p>

      <div className="project-grid">
        {projects.map((p) => (
          <article key={p.name} className="project-card">
            {p.image ? (
              <img className="project-shot" src={p.image} alt={`${p.name} screenshot`} />
            ) : (
              // TODO: placeholder tile — goes away once the project has an `image` in data.js
              <div className="project-shot placeholder" aria-hidden="true">
                {p.name}
              </div>
            )}
            <div className="project-head">
              <b>{p.name}</b>
              {p.result && <span className="project-result">★ {p.result}</span>}
            </div>
            <p>{p.pitch}</p>
            <p className="project-role">
              <b>my role:</b> {p.role}
            </p>
            <div className="tags">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="project-links">
              {p.demo && (
                <a className="btn" href={p.demo} target="_blank" rel="noreferrer">
                  live demo ↗
                </a>
              )}
              <a className="btn ghost" href={p.github} target="_blank" rel="noreferrer">
                github ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      <a className="projects-more" href={profile.github} target="_blank" rel="noreferrer">
        check the rest on my github ↗
      </a>
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
