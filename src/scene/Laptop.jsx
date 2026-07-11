import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils } from 'three'
import { useStore } from '../store'

// Lid hinge rotation (radians), measured about the hinge at the back of the base.
const LID_CLOSED = Math.PI / 2 - 0.06 // folded flat over the keyboard
const LID_OPEN = -0.35 // stood up and leaning back

export default function Laptop() {
  const lid = useRef()
  const phase = useStore((s) => s.phase)
  const open = useStore((s) => s.open)

  useFrame((_, dt) => {
    if (!lid.current) return
    const target = phase === 'closed' ? LID_CLOSED : LID_OPEN
    lid.current.rotation.x = MathUtils.damp(lid.current.rotation.x, target, 4, dt)
  })

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        open()
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* base */}
      <RoundedBox args={[2.2, 0.09, 1.5]} radius={0.03} smoothness={4} position={[0, 0.06, 0]} castShadow>
        <meshStandardMaterial color="#c9ccd1" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* keyboard deck */}
      <mesh position={[0, 0.106, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.95, 1.05]} />
        <meshStandardMaterial color="#26282c" roughness={0.7} />
      </mesh>

      {/* trackpad */}
      <mesh position={[0, 0.107, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 0.4]} />
        <meshStandardMaterial color="#3a3d42" roughness={0.5} />
      </mesh>

      {/* lid: hinge group pivots at the back edge, top of the base */}
      <group ref={lid} position={[0, 0.1, -0.72]} rotation={[LID_CLOSED, 0, 0]}>
        {/* lid shell */}
        <RoundedBox args={[2.2, 1.4, 0.05]} radius={0.03} smoothness={4} position={[0, 0.7, -0.028]} castShadow>
          <meshStandardMaterial color="#c9ccd1" metalness={0.6} roughness={0.35} />
        </RoundedBox>

        {/* screen face — blank for now, faint power glow */}
        <mesh position={[0, 0.7, 0.004]}>
          <planeGeometry args={[2.0, 1.22]} />
          <meshStandardMaterial
            color="#050607"
            emissive="#0b141c"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}
