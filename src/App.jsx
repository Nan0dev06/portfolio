import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Scene from './scene/Scene.jsx'
import Overlay from './ui/Overlay.jsx'
import { useStore } from './store'
import './styles.css'

export default function App() {
  const phase = useStore((s) => s.phase)

  // Nudge react-three-fiber's resize observer, which can miss the canvas's
  // initial size on mount (leaving it stuck at the 300x150 default). Fire a few
  // times over the first second to cover slow layout / observer timing.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const timers = [0, 100, 300, 600, 1500, 3000, 6000].map((ms) => setTimeout(fire, ms))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <>
      {/* sits behind the (transparent) canvas — only visible once the laptop
          starts opening, not while it's still closed on the mat */}
      <div className={`enter-bg ${phase !== 'closed' ? 'show' : ''}`} />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 4.9, 0.6], fov: 40 }}
        gl={{ alpha: true }}
        onCreated={(state) => {
          if (import.meta.env.DEV) window.__r3f = state // dev-only debug handle
        }}
      >
        {/* no scene background — canvas is transparent so the liminal room
            image (on <body>) shows behind the laptop as the camera dives in */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
      <Overlay />
    </>
  )
}
