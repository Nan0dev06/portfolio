import { useEffect, useState } from 'react'
import MenuBar from './MenuBar.jsx'
import Dock from './Dock.jsx'
import Window from './Window.jsx'
import DesktopIcons from './DesktopIcons.jsx'
import Cat from './Cat.jsx'
import { About, Projects, Resume, Contact, Guestbook } from './apps.jsx'
import { profile } from './data'
import './os.css'

export default function OS() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setBooted(true), 1400)
    return () => clearTimeout(id)
  }, [])

  if (!booted) {
    return (
      <div className="boot">
        <div className="boot-logo">
          ● {profile.name}
          <span>OS</span>
        </div>
        <div className="boot-bar">
          <div className="boot-fill" />
        </div>
      </div>
    )
  }

  return (
    <div className="desktop">
      <MenuBar />
      <DesktopIcons />

      <Window id="about" title="about me">
        <About />
      </Window>
      <Window id="projects" title="projects" width={520}>
        <Projects />
      </Window>
      <Window id="resume" title="resume.pdf">
        <Resume />
      </Window>
      <Window id="contact" title="contact">
        <Contact />
      </Window>
      <Window id="guestbook" title="guestbook" width={440}>
        <Guestbook />
      </Window>

      <Dock />
      <Cat />
    </div>
  )
}
