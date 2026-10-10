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

// phones and touch-only devices get the short path: no 3D intro, no login,
// straight to the desktop. Decided once at load — it picks which code is even
// downloaded, so it doesn't flip on a later resize.
export const isMobile =
  window.innerWidth < 900 || window.matchMedia('(hover: none) and (pointer: coarse)').matches

export const clamp =(v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi))
