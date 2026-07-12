import { useEffect, useState } from 'react'
import { profile } from './data'

export default function MenuBar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="menubar">
      <div className="menubar-left">
        <span className="menubar-logo">●</span>
        <b>{profile.name}OS</b>
        <span className="menubar-item">portfolio</span>
      </div>
      <div className="menubar-right">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  )
}
