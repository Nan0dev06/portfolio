import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import { MathUtils } from 'three'
import { useStore } from '../store'

// stickers scattered over the lid's outer face — x/y in lid-local coords
// (lid is 2.2 wide, 1.4 tall), s = sticker width, r = rotation
const STICKERS = [
  { n: 1, x: -0.75, y: 1.05, s: 0.34, r: 0.3 },
  { n: 2, x: -0.25, y: 1.1, s: 0.3, r: -0.2 },
  { n: 3, x: 0.3, y: 1.08, s: 0.36, r: 0.15 },
  { n: 4, x: 0.8, y: 1.0, s: 0.3, r: -0.35 },
  { n: 5, x: -0.85, y: 0.6, s: 0.3, r: -0.15 },
  { n: 6, x: -0.35, y: 0.68, s: 0.38, r: 0.1 },
  { n: 7, x: 0.18, y: 0.62, s: 0.3, r: 0.4 },
  { n: 8, x: 0.7, y: 0.55, s: 0.34, r: -0.1 },
  { n: 9, x: -0.7, y: 0.18, s: 0.32, r: 0.2 },
  { n: 10, x: -0.15, y: 0.22, s: 0.3, r: -0.3 },
  { n: 11, x: 0.35, y: 0.18, s: 0.3, r: 0.25 },
  { n: 12, x: 0.85, y: 0.15, s: 0.28, r: -0.2 },
]

function Sticker({ n, x, y, s, r, i }) {
  const url = `/stickers/sticker-${String(n).padStart(2, '0')}.png`
  const texture = useTexture(url)
  const aspect = texture.image ? texture.image.width / texture.image.height : 1
  return (
    // rotated to face the lid's outer (-z) side; tiny z stagger avoids z-fighting
    <mesh position={[x, y, -0.056 - i * 0.0004]} rotation={[0, Math.PI, r]}>
      <planeGeometry args={[s, s / aspect]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.1} roughness={0.6} />
    </mesh>
  )
}

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

        {/* stickers on the outer shell */}
        {STICKERS.map((st, i) => (
          <Sticker key={st.n} {...st} i={i} />
        ))}
      </group>
    </group>
  )
}
