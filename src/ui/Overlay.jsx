import { useStore } from '../store'
import OS from '../os/OS.jsx'

export default function Overlay() {
  const phase = useStore((s) => s.phase)

  return (
    <>
      {phase === 'closed' && <div className="hint">click the laptop</div>}
      <div className={`page ${phase === 'entered' ? 'show' : ''}`}>
        {phase === 'entered' && <OS />}
      </div>
    </>
  )
}
