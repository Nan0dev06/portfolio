import { create } from "zustand";

// window manager state
const initialWindows = {
  about: { open: false, minimized: false, x: 120, y: 90, z: 1 },
  projects: { open: false, minimized: false, x: 220, y: 130, z: 1 },
  resume: { open: false, minimized: false, x: 300, y: 110, z: 1 },
  contact: { open: false, minimized: false, x: 260, y: 170, z: 1 },
  guestbook: { open: false, minimized: false, x: 180, y: 150, z: 1 },
};

// desktop icons — kind picks the shared glossy glyph; `link` opens a URL
// instead of a window. x/y come from layoutIcons() below.
const iconDefs = {
  about: { label: "about_me", kind: "paint" },
  projects: { label: "projects", kind: "folder" },
  resume: { label: "resume", kind: "file" },
  contact: { label: "contact", kind: "envelope" },
  guestbook: { label: "guestbook", kind: "book" },
  languages: { label: "languages", kind: "folder" },
  github: {
    label: "github",
    kind: "github",
    link: "https://github.com/Nan0dev06",
  },
  linkedin: {
    label: "linkedin",
    kind: "linkedin",
    link: "https://www.linkedin.com/in/nour-al-shami-3701a037a/",
  },
};

// scattered layout, designed for a ≥900px-wide desktop (px from top-left)
const scatterPos = {
  about: { x: 70, y: 110 },
  projects: { x: 250, y: 80 },
  resume: { x: 150, y: 300 },
  contact: { x: 470, y: 150 },
  guestbook: { x: 360, y: 340 },
  languages: { x: 650, y: 110 },
  github: { x: 590, y: 320 },
  linkedin: { x: 760, y: 300 },
};

// on small screens the scatter runs off the right edge and icons become
// unreachable — fall back to a simple grid so everything is on screen
function layoutIcons() {
  const vw = window.innerWidth || 1024;
  const out = {};
  if (vw >= 900) {
    for (const [id, def] of Object.entries(iconDefs))
      out[id] = { ...def, ...scatterPos[id] };
    return out;
  }
  const cols = Math.max(2, Math.floor((vw - 16) / 104));
  const cellW = (vw - 16) / cols;
  Object.keys(iconDefs).forEach((id, i) => {
    out[id] = {
      ...iconDefs[id],
      x: Math.round(8 + (i % cols) * cellW + (cellW - 90) / 2),
      y: 44 + Math.floor(i / cols) * 112,
    };
  });
  return out;
}

const initialIcons = layoutIcons();

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

  // intrinsic height/width ratio of a window's content (e.g. a PDF page) —
  // lets maximize hug the content's real shape instead of stretching a
  // generic rectangle around it (see Window.jsx)
  setContentAspect: (id, ratio) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], contentAspect: ratio } } })),
}));
