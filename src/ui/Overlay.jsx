import { Suspense, lazy, useEffect } from 'react'
import { useStore } from '../store'

// The OS is a whole second app (windows, terminal, ascii sky) and none
// of it is needed until the laptop opens — split it out so the first load only
// ships the 3D intro.
const OS = lazy(() => import('../os/OS.jsx'))

export default function Overlay() {
  const phase = useStore((s) => s.phase)
  const skip = useStore((s) => s.skip)

  // warm the OS chunk while the browser is idle, so clicking the laptop never
  // waits on a network round-trip mid-transition
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = idle(() => import('../os/OS.jsx'))
    return () => cancel(id)
  }, [])

  return (
    <>
      {phase === 'closed' && <div className="hint">click the laptop</div>}
      {phase === 'closed' && (
        <button className="skip-intro" onClick={skip}>
          skip intro
        </button>
      )}
      <div className={`page ${phase === 'entered' ? 'show' : ''}`}>
        {phase === 'entered' && (
          <Suspense fallback={null}>
            <OS />
          </Suspense>
        )}
      </div>
    </>
  )
}
