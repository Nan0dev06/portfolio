import { useEffect, useState } from 'react'
import { profile } from './data'

// Animated login screen. Types a password by itself, then "enters".
// Purely a sequence — the visitor doesn't type anything.
// Background + globe are the user's own videos (public/login_bg.mp4, public/globe.mp4).
export default function Login({ onDone }) {
  const [dots, setDots] = useState(0)
  const [entering, setEntering] = useState(false)
  const PASS_LEN = 8

  useEffect(() => {
    // dev/test flag: ?holdlogin keeps the login screen up for inspection
    const hold = window.location.search.includes('holdlogin')
    let t
    const step = (n) => {
      if (n <= PASS_LEN) {
        setDots(n)
        t = setTimeout(() => step(n + 1), 150 + Math.random() * 120)
      } else if (!hold) {
        t = setTimeout(() => {
          setEntering(true)
          t = setTimeout(onDone, 900)
        }, 500)
      }
    }
    t = setTimeout(() => step(1), 700)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`login ${entering ? 'entering' : ''}`}>
      <video className="login-bg-video" src="/login_bg.mp4" autoPlay loop muted playsInline />
      <div className="login-scan" />

      <div className="login-card">
        <div className="globe-ring">
          <video className="globe-video" src="/globe.mp4" autoPlay loop muted playsInline />
        </div>
        <div className="login-user">{profile.name.toUpperCase()}</div>

        <div className="login-field">
          <span className="login-caret">›</span>
          <span className="login-dots">
            {'●'.repeat(dots)}
            {dots < PASS_LEN && <span className="blink">▍</span>}
          </span>
        </div>

        <div className="login-status">
          {entering ? 'ACCESS GRANTED' : dots >= PASS_LEN ? 'VERIFYING…' : 'AUTHENTICATING'}
        </div>
      </div>

      <div className="login-tag">{profile.name}OS // v2.0 — Y2K</div>
    </div>
  )
}
