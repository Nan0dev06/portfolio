import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox, useTexture } from '@react-three/drei'
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
  const url = `/stickers/sticker-${String(n).padStart(2, '0')}.webp`
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

// a single keycap
function Key({ position, w = 0.1 }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[w, 0.02, 0.1]} />
      <meshStandardMaterial color="#3a3d42" roughness={0.6} metalness={0.2} />
    </mesh>
  )
}

// grid of keys sitting on the deck, behind the trackpad
function Keys() {
  const cols = 14
  const topRows = 4
  const kx = 0.125
  const kz = 0.115
  const startX = -((cols - 1) * kx) / 2
  const startZ = -0.33
  const spaceZ = startZ + topRows * kz
  const keys = []
  for (let r = 0; r < topRows; r++) {
    for (let c = 0; c < cols; c++) {
      keys.push([startX + c * kx, 0.118, startZ + r * kz])
    }
  }
  return (
    <group>
      {keys.map((p, i) => (
        <Key key={i} position={p} />
      ))}
      <Key position={[0, 0.118, spaceZ]} w={0.72} />
      <Key position={[-0.58, 0.118, spaceZ]} w={0.16} />
      <Key position={[0.58, 0.118, spaceZ]} w={0.16} />
    </group>
  )
}

// pointing hand (Lucide "pointer", 24x24) — fingertip sits at roughly (8, 2)
const HAND = [
  'M22 14a8 8 0 0 1-8 8',
  'M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2',
  'M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1',
  'M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10',
  'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
]

// "tap here" hint pinned to the laptop: <Html> re-projects it every frame, so
// it stays on the lid through resizes. Never clickable — clicks fall through
// to the canvas (and so to the laptop) underneath.
function TapHint() {
  return (
    <Html position={[0, 0.2, 0.05]} zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}>
      <div className="tap-hint" aria-hidden="true">
        <span className="tap-ring" />
        <svg className="tap-hand" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* dark underlay so the white outline reads over the stickers */}
          <g stroke="#0b0b0d" strokeWidth="4.5">
            {HAND.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g stroke="#fff" strokeWidth="2">
            {HAND.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </div>
    </Html>
  )
}

export default function Laptop() {
  const lid = useRef()
  const phase = useStore((s) => s.phase)
  const open = useStore((s) => s.open)
  // the hint waits for the scene to sit idle for a moment; once the laptop is
  // clicked the phase never returns to 'closed', so it's gone for good
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIdle(true), 1500)
    return () => clearTimeout(t)
  }, [])

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
      {idle && phase === 'closed' && <TapHint />}

      {/* base */}
      <RoundedBox args={[2.2, 0.09, 1.5]} radius={0.03} smoothness={4} position={[0, 0.06, 0]} castShadow>
        <meshStandardMaterial color="#c9ccd1" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* keyboard deck */}
      <mesh position={[0, 0.106, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.95, 1.05]} />
        <meshStandardMaterial color="#26282c" roughness={0.7} />
      </mesh>

      {/* keys */}
      <Keys />

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
