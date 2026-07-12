import { create } from 'zustand'

// phase: 'closed'  -> laptop shut, waiting for a click
//        'opening' -> lid rising + camera dollying in
//        'entered' -> camera arrived, main page revealed
export const useStore = create((set) => ({
  // dev shortcut: open http://localhost:5173/#os to skip the 3D intro
  phase: window.location.hash === '#os' ? 'entered' : 'closed',
  open: () => set((s) => (s.phase === 'closed' ? { phase: 'opening' } : {})),
  setEntered: () => set((s) => (s.phase === 'opening' ? { phase: 'entered' } : {})),
}))
