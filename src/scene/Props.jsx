import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Group, Vector3 } from 'three'

// Wraps a GLB of unknown scale/origin: uniformly scales it so its largest
// dimension equals `size`, then sits it on the mat (bbox bottom at y=0),
// centered on `position`. `preRotation` (e.g. laying a standing model on its
// side) is applied before the floor-snap so the result still rests on the mat.
function Model({ url, size, position = [0, 0, 0], rotationY = 0, preRotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url)

  const normalized = useMemo(() => {
    const clone = scene.clone(true)
    const box = new Box3().setFromObject(clone)
    const dims = box.getSize(new Vector3())
    const s = size / Math.max(dims.x, dims.y, dims.z)
    clone.scale.setScalar(s)
    // rotate via a wrapper so the GLB root's own rotation is preserved
    const holder = new Group()
    holder.rotation.set(...preRotation)
    holder.add(clone)
    const box2 = new Box3().setFromObject(holder)
    const center = box2.getCenter(new Vector3())
    holder.position.set(-center.x, -box2.min.y, -center.z)
    const outer = new Group()
    outer.add(holder)
    return outer
  }, [scene, size, ...preRotation])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive object={normalized} />
    </group>
  )
}

const MODELS = '/models'

// Desk flat-lay, arranged to read nicely from the top-down camera.
export default function Props() {
  return (
    <group>
      <Model url={`${MODELS}/coffee_mug.glb`} size={0.85} position={[1.75, 0, 0.6]} rotationY={-0.5} />
      <Model url={`${MODELS}/mouse.glb`} size={0.55} position={[1.65, 0, -0.6]} rotationY={0.25} />
      {/* laid on its side so it rests flat on the mat */}
      <Model
        url={`${MODELS}/headphones.glb`}
        size={1.6}
        position={[2.75, 0, -1.3]}
        rotationY={0.9}
        preRotation={[0, 0, Math.PI / 2]}
      />
      <Model url={`${MODELS}/notebook.glb`} size={1.7} position={[-2.05, 0, 0]} rotationY={0.35} />
      <Model url={`${MODELS}/glasses.glb`} size={1.3} position={[-1.75, 0, 1.6]} rotationY={-0.3} />
      <Model url={`${MODELS}/crumpled_paper.glb`} size={0.6} position={[-0.6, 0, 1.55]} />
      <Model url={`${MODELS}/sleeping_cat.glb`} size={1.6} position={[-2.4, 0, -1.6]} rotationY={0.7} />
    </group>
  )
}

useGLTF.preload(`${MODELS}/coffee_mug.glb`)
useGLTF.preload(`${MODELS}/mouse.glb`)
useGLTF.preload(`${MODELS}/headphones.glb`)
useGLTF.preload(`${MODELS}/notebook.glb`)
useGLTF.preload(`${MODELS}/glasses.glb`)
useGLTF.preload(`${MODELS}/crumpled_paper.glb`)
useGLTF.preload(`${MODELS}/sleeping_cat.glb`)
