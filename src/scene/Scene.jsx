import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import { useStore } from '../store'
import Laptop from './Laptop.jsx'
import Mat from './Mat.jsx'
import Props from './Props.jsx'

// Camera keyframes: a top-down flat-lay over the desk while the laptop is
// closed, then the head-on push-in to the screen once it opens.
const OVERVIEW_POS = new Vector3(0, 6.2, 1.2)
const OVERVIEW_LOOK = new Vector3(0, 0.15, -0.2)
const ENTERED_POS = new Vector3(0, 0.95, 1.75)
const ENTERED_LOOK = new Vector3(0, 0.85, -0.35)

export default function Scene() {
  const { camera } = useThree()
  const look = useRef(OVERVIEW_LOOK.clone())
  const phase = useStore((s) => s.phase)
  const setEntered = useStore((s) => s.setEntered)

  useFrame((_, dt) => {
    const active = phase !== 'closed'
    const tp = active ? ENTERED_POS : OVERVIEW_POS
    const tl = active ? ENTERED_LOOK : OVERVIEW_LOOK
    const l = 2.5

    camera.position.x = MathUtils.damp(camera.position.x, tp.x, l, dt)
    camera.position.y = MathUtils.damp(camera.position.y, tp.y, l, dt)
    camera.position.z = MathUtils.damp(camera.position.z, tp.z, l, dt)

    look.current.x = MathUtils.damp(look.current.x, tl.x, l, dt)
    look.current.y = MathUtils.damp(look.current.y, tl.y, l, dt)
    look.current.z = MathUtils.damp(look.current.z, tl.z, l, dt)
    camera.lookAt(look.current)

    if (phase === 'opening' && camera.position.distanceTo(tp) < 0.06) {
      setEntered()
    }
  })

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} />

      <Mat />
      <Laptop />
      <Props />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={14} blur={2.6} far={4} />
    </group>
  )
}
