import { create } from 'zustand'

// phase: 'closed'  -> laptop shut, waiting for a click
//        'opening' -> lid rising + camera dollying in
//        'entered' -> camera arrived, main page revealed
export const useStore = create((set) => ({
  phase: 'closed',
  open: () => set((s) => (s.phase === 'closed' ? { phase: 'opening' } : {})),
  setEntered: () => set((s) => (s.phase === 'opening' ? { phase: 'entered' } : {})),
}))
