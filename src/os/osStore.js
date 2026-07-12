import { create } from 'zustand'

const initialWindows = {
  about: { open: false, x: 140, y: 90, z: 1 },
  projects: { open: false, x: 220, y: 130, z: 1 },
  resume: { open: false, x: 300, y: 110, z: 1 },
  contact: { open: false, x: 260, y: 170, z: 1 },
  guestbook: { open: false, x: 180, y: 150, z: 1 },
}

export const useOS = create((set) => ({
  windows: initialWindows,
  topZ: 1,
  openWindow: (id) =>
    set((s) => ({
      topZ: s.topZ + 1,
      windows: { ...s.windows, [id]: { ...s.windows[id], open: true, z: s.topZ + 1 } },
    })),
  closeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], open: false } },
    })),
  focusWindow: (id) =>
    set((s) => ({
      topZ: s.topZ + 1,
      windows: { ...s.windows, [id]: { ...s.windows[id], z: s.topZ + 1 } },
    })),
  moveWindow: (id, x, y) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], x, y } },
    })),
}))
