// Green cutting-board mat. Solid green for now; a grid/measurement
// texture drops in later (public/textures/).
export default function Mat() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[16, 12]} />
      <meshStandardMaterial color="#2f6b4f" roughness={0.92} metalness={0} />
    </mesh>
  )
}
