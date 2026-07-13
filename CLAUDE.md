# CLAUDE.md

Project-specific instructions for Claude Code sessions in this repo. See
[README.md](README.md) for the general overview — this file is about how to
work in this codebase specifically.

## What this is

Nour's portfolio: a 3D laptop (`src/scene/`) that opens into "nanoOS"
(`src/os/`), a small Y2K-cyber desktop environment. React + Vite +
react-three-fiber. No backend.

## Hard rule: commits

**Never add a `Co-Authored-By` trailer to commits in this repo.** The user
has stated this repeatedly and explicitly. Commit as the repo's own git user
only.

## Where content lives

All personal content — name, bio, projects, résumé path, languages — is
centralized in [`src/os/data.js`](src/os/data.js). If asked to update "the
about me" / "the projects" / "my resume", this is almost always the file to
edit, not the component files.

## Dev workflow

- `npm run dev` → `http://localhost:5173`
- **`http://localhost:5173/#os` skips the 3D intro** and lands directly on
  the desktop — use this when iterating on OS/window/app work so you're not
  re-clicking the laptop every reload.
- `window.__r3f` is a dev-only debug handle set in `App.jsx`'s `onCreated`
  (only exists when `import.meta.env.DEV`) — gives console access to the r3f
  `state` (`scene`, `camera`, `gl`, `advance()`) for inspecting/driving the
  3D scene without eyeballing it.
- `index.html` has a `?headless` query-param shim that replaces
  `requestAnimationFrame` with a `setTimeout`-driven version. The preview
  browser pane used for verification throttles real rAF in backgrounded
  tabs, which silently stalls the 3D scene's `useFrame` loops and CSS
  transitions; `?headless` keeps things moving so automated checks don't
  hang. It's harmless in production — only add `?headless` to the URL when
  testing, never rely on it for real user-facing behavior.
- When checking a CSS transition's *end state* via `getComputedStyle` in a
  backgrounded/throttled tab, the reading can get stuck mid-transition even
  though the class/rule is correct. To check the resolved value regardless
  of timing, temporarily set `el.style.transition = 'none'` and force a
  reflow (`void el.offsetHeight`) before reading — isolates the CSS rule
  from the animation clock.

## Known layout gotcha

The desktop has several full-viewport absolutely-positioned layers stacked
(ascii-sky background, desktop-icons, windows, dock/menubar). **Any new
full-screen layer must have `pointer-events: none` on the container itself**,
with `pointer-events: auto` only on the actual interactive children —
otherwise it silently swallows clicks meant for whatever is visually
underneath it, regardless of z-index. This exact bug (desktop-icons
container blocking window close buttons) cost a long debugging session —
don't reintroduce it.

Z-index layering, low to high: ascii-sky (0) → desktop-icons (10) → lang
chips (12) → windows (20+, dynamic via `osStore`'s `topZ`) → dock/menubar
(500).

## Gitignored raw asset folders

`3d_models/`, `images_stickers/`, `os_background/`, `os_login_screen/` are
intentionally not committed — they're source material (multi-MB raw
GLTF/zip/video files). The optimized copies actually used by the site are
already in `public/` (compressed `.glb`s, cropped PNGs, compressed `.mp4`s).
Don't try to re-add the raw folders to git; if a raw asset needs
reprocessing, the compressed output in `public/` is what to replace.

## Tone

The OS's copy is lowercase and casual throughout (window titles, button
labels, placeholder text) — match that style in any new UI text.
