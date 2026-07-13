import { create } from "zustand";

// window manager state
const initialWindows = {
  about: { open: false, minimized: false, x: 120, y: 90, z: 1 },
  projects: { open: false, minimized: false, x: 220, y: 130, z: 1 },
  resume: { open: false, minimized: false, x: 300, y: 110, z: 1 },
  contact: { open: false, minimized: false, x: 260, y: 170, z: 1 },
  guestbook: { open: false, minimized: false, x: 180, y: 150, z: 1 },
};

// desktop icons — scattered initial layout (px from top-left of the desktop).
// kind picks the shared glossy glyph; `link` opens a URL instead of a window.
const initialIcons = {
  about: { x: 70, y: 110, label: "about_me", kind: "paint" },
  projects: { x: 250, y: 80, label: "projects", kind: "folder" },
  resume: { x: 150, y: 300, label: "resume", kind: "file" },
  contact: { x: 470, y: 150, label: "contact", kind: "envelope" },
  guestbook: { x: 360, y: 340, label: "guestbook", kind: "book" },
  languages: { x: 650, y: 110, label: "languages", kind: "folder" },
  github: {
    x: 590,
    y: 320,
    label: "github",
    kind: "github",
    link: "https://github.com/Nan0dev06",
  },
  linkedin: {
    x: 760,
    y: 300,
    label: "linkedin",
    kind: "linkedin",
    link: "https://www.linkedin.com/in/nour-al-shami-3701a037a/",
  },
};

// windows always stack above the desktop icon layer (z:10) and the scattered
// language chips (z:12), but below the menu bar / dock (z:500) — see os.css.
const BASE_Z = 20;

export const useOS = create((set) => ({
  windows: initialWindows,
  icons: initialIcons,
  topZ: BASE_Z,

  // click an icon/dock item: closed → open it; open+visible → minimize
  // (hide) it; open+minimized → restore and focus it.
  toggleWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w.open) {
        return {
          topZ: s.topZ + 1,
          windows: { ...s.windows, [id]: { ...w, open: true, minimized: false, z: s.topZ + 1 } },
        }
      }
      if (w.minimized) {
        return {
          topZ: s.topZ + 1,
          windows: { ...s.windows, [id]: { ...w, minimized: false, z: s.topZ + 1 } },
        }
      }
      return { windows: { ...s.windows, [id]: { ...w, minimized: true } } }
    }),
  closeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], open: false, minimized: false } },
    })),
  minimizeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
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

  moveIcon: (id, x, y) =>
    set((s) => ({ icons: { ...s.icons, [id]: { ...s.icons[id], x, y } } })),
}));
