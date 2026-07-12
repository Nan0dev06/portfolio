import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Scene from './scene/Scene.jsx'
import Overlay from './ui/Overlay.jsx'
import './styles.css'

export default function App() {
  // Nudge react-three-fiber's resize observer, which can miss the canvas's
  // initial size on mount (leaving it stuck at the 300x150 default). Fire a few
  // times over the first second to cover slow layout / observer timing.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const timers = [0, 100, 300, 600].map((ms) => setTimeout(fire, ms))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 6.2, 1.2], fov: 40 }}
        onCreated={(state) => {
          if (import.meta.env.DEV) window.__r3f = state // dev-only debug handle
        }}
      >
        <color attach="background" args={['#0b0b0d']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
      <Overlay />
    </>
  )
}
