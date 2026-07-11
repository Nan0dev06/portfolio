// Desk dressing. Primitive placeholders for now — these get swapped for
// CC0 .glb models (public/models/) one at a time.
export default function Props() {
  return (
    <group>
      {/* coffee mug, right of the laptop */}
      <group position={[2.15, 0, 0.4]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.24, 0.56, 32]} />
          <meshStandardMaterial color="#e8e6e1" roughness={0.4} />
        </mesh>
        {/* coffee surface */}
        <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.24, 32]} />
          <meshStandardMaterial color="#3a2418" roughness={0.3} />
        </mesh>
        {/* handle */}
        <mesh position={[0.31, 0.28, 0]} castShadow>
          <torusGeometry args={[0.14, 0.035, 12, 24]} />
          <meshStandardMaterial color="#e8e6e1" roughness={0.4} />
        </mesh>
      </group>

      {/* crumpled paper ball, front left */}
      <mesh position={[-1.9, 0.16, 0.95]} castShadow>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#f2f0eb" roughness={0.95} flatShading />
      </mesh>

      {/* notebook + pen, left of the laptop */}
      <group position={[-2.0, 0, -0.15]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[1.0, 0.1, 1.35]} />
          <meshStandardMaterial color="#b23b3b" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 0.13, 0]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
          <meshStandardMaterial color="#1d1f22" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
