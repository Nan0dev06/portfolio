import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

// Green self-healing cutting mat, drawn to match the reference: dark border
// with ruler numbers, lighter gridded field, "CUTTING MAT 3022" title.
// The whole mat is the scene frame — Scene.jsx fits the camera to it.
export const MAT_W = 7.4
export const MAT_H = 3.6
export const MAT_Z = 0.28 // mat center sits slightly behind the laptop

function drawMat() {
  const W = 2048
  const H = Math.round((W * MAT_H) / MAT_W)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')

  // dark border zone
  ctx.fillStyle = '#16332a'
  ctx.fillRect(0, 0, W, H)

  // inner field
  const L = 44, R = 44, T = 44, B = 44
  const fw = W - L - R
  const fh = H - T - B
  const g = ctx.createRadialGradient(W / 2, H / 2, H / 4, W / 2, H / 2, W * 0.6)
  g.addColorStop(0, '#2e6f51')
  g.addColorStop(1, '#265c44')
  ctx.fillStyle = g
  ctx.fillRect(L, T, fw, fh)

  // grid — 28 columns like the reference
  const COLS = 28
  const cell = fw / COLS
  const rows = Math.floor(fh / cell)
  const line = '#bfe3cf'
  ctx.strokeStyle = line

  ctx.globalAlpha = 0.35
  ctx.lineWidth = 2
  for (let i = 0; i <= COLS; i++) {
    const x = L + i * cell
    ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, T + fh); ctx.stroke()
  }
  for (let j = 0; j <= rows; j++) {
    const y = T + j * cell
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + fw, y); ctx.stroke()
  }

  // heavier line every 5 cells + field frame
  ctx.globalAlpha = 0.6
  ctx.lineWidth = 4
  for (let i = 0; i <= COLS; i += 5) {
    const x = L + i * cell
    ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, T + fh); ctx.stroke()
  }
  ctx.strokeRect(L, T, fw, fh)

  ctx.globalAlpha = 1
  return c
}

export default function Mat() {
  const texture = useMemo(() => {
    const t = new CanvasTexture(drawMat())
    t.colorSpace = SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MAT_Z]} receiveShadow>
      <planeGeometry args={[MAT_W, MAT_H]} />
      <meshStandardMaterial map={texture} roughness={0.92} metalness={0} />
    </mesh>
  )
}
