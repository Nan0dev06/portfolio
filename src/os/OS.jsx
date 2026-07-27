import { useEffect, useState } from 'react'
import MenuBar from './MenuBar.jsx'
import Dock from './Dock.jsx'
import Window from './Window.jsx'
import DesktopIcons from './DesktopIcons.jsx'
import AsciiSky from './AsciiSky.jsx'
import Login from './Login.jsx'
import Paint from './Paint.jsx'
import Terminal from './Terminal.jsx'
import { Projects, Resume, Contact } from './apps.jsx'
import './os.css'

export default function OS() {
  // 'power' → brief black screen (laptop turning on) → 'login' → 'desktop'
  const [phase, setPhase] = useState('power')

  useEffect(() => {
    if (phase !== 'power') return
    const t = setTimeout(() => setPhase('login'), 650)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'power') return <div className="power-on" />
  if (phase === 'login') return <Login onDone={() => setPhase('desktop')} />

  return (
    <div className="desktop">
      <AsciiSky />
      <MenuBar />
      <DesktopIcons />

      <Window id="terminal" title="terminal — nanosh" width={760} height={520} bare>
        <Terminal />
      </Window>
      <Window id="paint" title="paint.exe" width={520}>
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

      <Dock />
    </div>
  )
}
