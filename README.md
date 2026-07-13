# portfolio

Nour Al Shami's portfolio site — a 3D laptop sitting on a green cutting mat.
Click it, and it opens into **nanoOS**, a tiny Y2K-cyber desktop environment
you can actually click around in.

**Live:** _(add your deployed URL here once it's live)_

## the idea

Instead of a normal scrolling one-pager, the site is a desktop metaphor:

1. **Desk scene** — a top-down 3D flat-lay (laptop, coffee, headphones,
   notebook, a sleeping cat) built with `react-three-fiber`. Click the laptop
   and the lid opens while the camera dives into the screen.
2. **Login** — a short animated "logging in" sequence (video background +
   spinning globe avatar + auto-typed password), no real input required.
3. **nanoOS** — the actual portfolio: draggable desktop icons, glass windows
   with working traffic-light controls (close / minimize / maximize), a
   dock, an interactive ASCII-cloud wallpaper, and a handful of little apps:
   - **about_me** — a working MS-Paint-style app with a real drawable canvas
   - **projects** — cards for real GitHub projects
   - **resume** — renders the résumé PDF as an inline preview + download
   - **contact** — email / GitHub
   - **guestbook** — sign-the-guestbook (currently local-only)
   - **languages** — a folder that spills its contents across the desktop

## stack

- **React + Vite**
- **`@react-three/fiber`** / **`@react-three/drei`** / **`three`** — the 3D desk scene
- **`zustand`** — two small stores: `store.js` (3D intro phase) and
  `src/os/osStore.js` (window manager: open/close/minimize/maximize/drag/z-order)
- **`pdfjs-dist`** — renders the résumé PDF onto a `<canvas>` for the preview

No backend yet — the guestbook is local-only until it's wired up.

## running it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Dev shortcut: open `http://localhost:5173/#os` to skip the 3D intro and land
straight on the desktop.

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## project layout

```
src/
  App.jsx            entry: <Canvas> (the 3D desk) + <Overlay/>
  store.js            3D intro phase: 'closed' → 'opening' → 'entered'
  scene/               the 3D desk — laptop, mat, props, camera
  ui/Overlay.jsx       the fullscreen page that fades in and mounts the OS
  os/
    osStore.js         window manager state (open/close/minimize/z-order/drag)
    OS.jsx             power-on → Login → desktop
    Login.jsx          animated login screen
    Window.jsx          glass window chrome (star buttons, drag, maximize)
    Dock.jsx / DesktopIcons.jsx   the two places apps launch from
    apps.jsx           Projects / Resume / Contact / Guestbook
    Paint.jsx           the about-me app (drawable canvas)
    data.js            ALL personal content — profile, projects, languages
public/
  models/              3D prop models (.glb)
  stickers/            laptop-lid sticker PNGs
  resume.pdf, cursor.png, login_bg.mp4, globe.mp4, ...
```

**To edit your own content** (name, bio, projects, résumé, languages), the
only file you need is [`src/os/data.js`](src/os/data.js).

## assets not in git

A few raw/source asset folders are intentionally gitignored — the site only
ships the optimized copies already sitting in `public/`:

```
3d_models/        raw .glb + zips before compression
images_stickers/  original sticker PNGs
os_background/    old desktop background source
os_login_screen/  source videos for the login screen
```

If you're rebuilding those, see the corresponding files under `public/`.
