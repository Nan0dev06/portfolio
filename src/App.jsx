import { Suspense, lazy } from 'react'
import Overlay from './ui/Overlay.jsx'
import { isMobile } from './os/useViewport'
import './styles.css'

// the 3D desk intro (three.js + models + stickers) is desktop-only, so it
// lives in its own chunk that phones never request
const Intro = lazy(() => import('./scene/Intro.jsx'))

export default function App() {
  return (
    <>
      {!isMobile && (
        <Suspense fallback={null}>
          <Intro />
        </Suspense>
      )}
      <Overlay />
    </>
  )
}
