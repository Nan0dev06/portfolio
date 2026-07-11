import { useStore } from '../store'

export default function Overlay() {
  const phase = useStore((s) => s.phase)

  return (
    <>
      {phase === 'closed' && <div className="hint">click the laptop</div>}
      {/* main page — intentionally blank for now */}
      <div className={`page ${phase === 'entered' ? 'show' : ''}`} />
    </>
  )
}
