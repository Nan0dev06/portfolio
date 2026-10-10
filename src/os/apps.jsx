import { profile, projects, tagline } from './data'

export function Projects() {
  return (
    <div className="app-projects">
      <p className="projects-tagline">{tagline}</p>

      <div className="project-grid">
        {projects.map((p, i) => (
          <article key={p.name} className="project-card">
            {p.image ? (
              <img
                className="project-shot"
                src={p.image}
                alt={`${p.name} screenshot`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              // placeholder tile for a project with no `image` in data.js
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

// the resume as a little document viewer: a preview of the page plus a download
export function Resume() {
  return (
    <div className="app-resume">
      <div className="resume-bar">
        <span>{profile.fullName} · 1 page</span>
        <a className="btn" href={profile.resume} download="Nour_Al_Shami_Resume.pdf">
          download pdf ↓
        </a>
      </div>
      <div className="resume-scroll">
        <img className="resume-page" src={profile.resumePreview} alt={`${profile.fullName}'s resume`} />
      </div>
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
