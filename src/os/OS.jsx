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
import { useOS } from './osStore'
import { isMobile } from './useViewport'
import './os.css'

const PROJECTS_W = 1160 // four cards side by side

export default function OS() {
  // 'power' → brief black screen (laptop turning on) → 'login' → 'desktop'
  // (mobile, and "skip intro" on the desk scene, jump past the login too)
  const [phase, setPhase] = useState(() =>
    isMobile || useStore.getState().skipped ? 'desktop' : 'power'
  )

  useEffect(() => {
    if (phase !== 'power') return
    const t = setTimeout(() => setPhase('login'), 300)
    return () => clearTimeout(t)
  }, [phase])

  // the desktop always comes up with projects already open — it's the one
  // thing every visitor is here for. Guarded so a re-run can't toggle it shut.
  useEffect(() => {
    if (phase !== 'desktop') return
    const { windows, moveWindow, toggleWindow } = useOS.getState()
    if (windows.projects.open) return
    moveWindow('projects', Math.max(8, (window.innerWidth - PROJECTS_W) / 2), 40)
    toggleWindow('projects')
  }, [phase])

  if (phase === 'power') return <div className="power-on" />
  if (phase === 'login') return <Login onDone={() => setPhase('desktop')} />

  return (
    <div className={`desktop ${isMobile ? 'mobile' : ''}`}>
      <AsciiSky />
      <MenuBar />
      <DesktopIcons />

      <Window id="terminal" title="terminal — nanosh" width={760} height={520} bare>
        <Terminal />
      </Window>
      <Window id="paint" title="paint.exe" width={520}>
        <Paint />
      </Window>
      {/* large on desktop; fills the screen on phones */}
      <Window id="projects" title="projects" width={PROJECTS_W} height={672} defaultMaximized={isMobile}>
        <Projects />
      </Window>
      <Window id="contact" title="contact">
        <Contact />
      </Window>

      <Dock />
    </div>
  )
}
