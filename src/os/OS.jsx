import { useState } from 'react'
import MenuBar from './MenuBar.jsx'
import Dock from './Dock.jsx'
import Window from './Window.jsx'
import DesktopIcons from './DesktopIcons.jsx'
import AsciiSky from './AsciiSky.jsx'
import Login from './Login.jsx'
import Paint from './Paint.jsx'
import { Projects, Resume, Contact, Guestbook } from './apps.jsx'
import './os.css'

export default function OS() {
  const [entered, setEntered] = useState(false)

  if (!entered) return <Login onDone={() => setEntered(true)} />

  return (
    <div className="desktop">
      <AsciiSky />
      <MenuBar />
      <DesktopIcons />

      <Window id="about" title="about_me.paint" width={520}>
        <Paint />
      </Window>
      <Window id="projects" title="projects" width={520}>
        <Projects />
      </Window>
      <Window id="resume" title="resume.exe">
        <Resume />
      </Window>
      <Window id="contact" title="contact">
        <Contact />
      </Window>
      <Window id="guestbook" title="guestbook" width={440}>
        <Guestbook />
      </Window>

      <Dock />
    </div>
  )
}
