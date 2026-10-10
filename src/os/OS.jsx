import { useEffect, useState } from 'react'
import MenuBar from './MenuBar.jsx'
import Dock from './Dock.jsx'
import Window from './Window.jsx'
import DesktopIcons from './DesktopIcons.jsx'
import AsciiSky from './AsciiSky.jsx'
import Login from './Login.jsx'
import Paint from './Paint.jsx'
import Terminal from './Terminal.jsx'
import { Projects, Contact } from './apps.jsx'
import { useStore } from '../store'
import { isMobile } from './useViewport'
import './os.css'

export default function OS() {
  // 'power' → brief black screen (laptop turning on) → 'login' → 'desktop'
  // (mobile, and "skip intro" on the desk scene, jump past the login too)
  const [phase, setPhase] = useState(() =>
    isMobile || useStore.getState().skipped ? 'desktop' : 'power'
  )

  useEffect(() => {
    if (phase !== 'power') return
    const t = setTimeout(() => setPhase('login'), 650)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'power') return <div className="power-on" />
  if (phase === 'login') return <Login onDone={() => setPhase('desktop')} />

  return (
    <div className={`desktop ${isMobile ? 'mobile' : ''}`}>
      {/* phones get a static sky (see .desktop.mobile) instead of the canvas loop */}
      {!isMobile && <AsciiSky />}
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
      <Window id="contact" title="contact">
        <Contact />
      </Window>

      <Dock />
    </div>
  )
}
