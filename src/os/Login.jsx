import { useEffect, useState } from 'react'
import { profile } from './data'

// Animated login screen. Types a password by itself, then "enters".
// Purely a sequence — the visitor doesn't type anything. Kept short (~1.2s,
// ~1.5s with the power-on flick before it); a click or Enter skips the rest.
// Background + globe are the user's own videos (public/login_bg.mp4, public/globe.mp4).
export default function Login({ onDone }) {
  const [dots, setDots] = useState(0)
  const [entering, setEntering] = useState(false)
  const PASS_LEN = 8

  useEffect(() => {
    // dev/test flag: ?holdlogin keeps the login screen up for inspection
    const hold = window.location.search.includes('holdlogin')
    // every beat is timed from mount rather than chained off the previous
    // one, so slow frames can't stack up and stretch the sequence
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))
    for (let n = 1; n <= PASS_LEN; n++) at(40 + n * 60, () => setDots(n))
    if (!hold) {
      at(680, () => setEntering(true))
      at(1150, onDone)
    }
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  useEffect(() => {
    const onKey = (e) => e.key === 'Enter' && onDone()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  return (
    <div className={`login ${entering ? 'entering' : ''}`} onClick={onDone}>
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
