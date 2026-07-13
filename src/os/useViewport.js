import { useEffect, useState } from 'react'

// live window size — lets absolutely-positioned OS elements (icons, windows,
// scattered language chips) clamp themselves onto the visible screen on small
// viewports and after resizes/rotations
export function useViewport() {
  const [size, setSize] = useState({ vw: window.innerWidth, vh: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ vw: window.innerWidth, vh: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi))
