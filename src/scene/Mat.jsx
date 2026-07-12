import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

// Green self-healing cutting mat, drawn procedurally: base green, fine grid,
// bolder major grid, border frame, and 45° corner diagonals.
const MAT_W = 16
const MAT_H = 12

function drawMat() {
  const PX = 128 // pixels per world unit
  const w = MAT_W * PX
  const h = MAT_H * PX
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  // base with a subtle radial shade
  const g = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w * 0.7)
  g.addColorStop(0, '#37744f')
  g.addColorStop(1, '#2b5f42')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const inset = PX * 0.5 // border frame inset
  const line = '#a8d8bd'

  // fine grid (every unit)
  ctx.strokeStyle = line
  ctx.globalAlpha = 0.28
  ctx.lineWidth = 2
  for (let x = inset; x <= w - inset + 1; x += PX) {
    ctx.beginPath(); ctx.moveTo(x, inset); ctx.lineTo(x, h - inset); ctx.stroke()
  }
  for (let y = inset; y <= h - inset + 1; y += PX) {
    ctx.beginPath(); ctx.moveTo(inset, y); ctx.lineTo(w - inset, y); ctx.stroke()
  }

  // major grid (every 4 units)
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 4
  for (let x = inset; x <= w - inset + 1; x += PX * 4) {
    ctx.beginPath(); ctx.moveTo(x, inset); ctx.lineTo(x, h - inset); ctx.stroke()
  }
  for (let y = inset; y <= h - inset + 1; y += PX * 4) {
    ctx.beginPath(); ctx.moveTo(inset, y); ctx.lineTo(w - inset, y); ctx.stroke()
  }

  // border frame
  ctx.globalAlpha = 0.8
  ctx.lineWidth = 6
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2)

  // 45° diagonals from the corners of the frame
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 3
  const d = PX * 3
  ctx.beginPath(); ctx.moveTo(inset, inset); ctx.lineTo(inset + d, inset + d); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(w - inset, inset); ctx.lineTo(w - inset - d, inset + d); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(inset, h - inset); ctx.lineTo(inset + d, h - inset - d); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(w - inset, h - inset); ctx.lineTo(w - inset - d, h - inset - d); ctx.stroke()

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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[MAT_W, MAT_H]} />
      <meshStandardMaterial map={texture} roughness={0.92} metalness={0} />
    </mesh>
  )
}
