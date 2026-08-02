import { create } from "zustand";

// window manager state
const initialWindows = {
  terminal: { open: false, minimized: false, x: 120, y: 70, z: 1 },
  paint: { open: false, minimized: false, x: 120, y: 90, z: 1 },
  projects: { open: false, minimized: false, x: 220, y: 130, z: 1 },
  contact: { open: false, minimized: false, x: 260, y: 170, z: 1 },
};

// desktop icons — kind picks the shared glossy glyph; `link` opens a URL
// instead of a window. x/y come from layoutIcons() below.
const iconDefs = {
  terminal: { label: "terminal", kind: "terminal" },
  paint: { label: "paint", kind: "paint" },
  projects: { label: "projects", kind: "folder" },
  contact: { label: "contact", kind: "envelope" },
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
  terminal: { x: 70, y: 110 },
  paint: { x: 400, y: 220 },
  projects: { x: 250, y: 80 },
  contact: { x: 470, y: 150 },
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

  // w/h start undefined — the window sizes itself to its content until the
  // user drags a resize handle, after which these take over (see Window.jsx)
  resizeWindow: (id, w, h) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], w, h } },
    })),

  moveIcon: (id, x, y) =>
    set((s) => ({ icons: { ...s.icons, [id]: { ...s.icons[id], x, y } } })),
}));
