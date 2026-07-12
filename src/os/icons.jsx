// Shared 3D-glossy Y2K icon set. Same components render on the desktop AND the
// dock so every app's icon matches. viewBox is 0 0 64 64 for all.

function Defs({ id, from, mid, to }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="0.5" stopColor={mid} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-shine`} cx="0.35" cy="0.25" r="0.7">
        <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

const Shadow = () => <ellipse cx="32" cy="59" rx="20" ry="4" fill="rgba(4,8,40,0.35)" />

export function Folder() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="fld" from="#8fb2ff" mid="#3350ff" to="#1a27c8" />
      <Shadow />
      <path d="M6 16a4 4 0 0 1 4-4h14l6 6h24a4 4 0 0 1 4 4v3H6z" fill="#1a27c8" />
      <path d="M6 22a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill={`url(#fld-body)`} stroke="#0a1490" strokeWidth="1.2" />
      <path d="M10 24h44v12c-8 3-14 4-22 4s-14-1-22-4z" fill={`url(#fld-gloss)`} opacity="0.7" />
      <ellipse cx="24" cy="30" rx="16" ry="7" fill={`url(#fld-shine)`} />
    </svg>
  )
}

export function FileDoc() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="doc" from="#f2f6ff" mid="#cdd9ff" to="#9fb4ff" />
      <Shadow />
      <path d="M14 6h24l14 14v34a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill={`url(#doc-body)`} stroke="#2536d6" strokeWidth="1.2" />
      <path d="M38 6l14 14H42a4 4 0 0 1-4-4z" fill="#7a92ff" />
      <g fill="#2f43e0">
        <rect x="20" y="30" width="24" height="3" rx="1.5" />
        <rect x="20" y="38" width="24" height="3" rx="1.5" />
        <rect x="20" y="46" width="16" height="3" rx="1.5" />
      </g>
      <path d="M14 8h22v10c-8 2-15 2-22 0z" fill="#fff" opacity="0.6" />
    </svg>
  )
}

export function Envelope() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="env" from="#9fc0ff" mid="#4f6bff" to="#2233d6" />
      <Shadow />
      <rect x="6" y="14" width="52" height="36" rx="5" fill={`url(#env-body)`} stroke="#0a1490" strokeWidth="1.2" />
      <path d="M6 18l26 18 26-18" fill="none" stroke="#fff" strokeWidth="2.4" strokeOpacity="0.85" />
      <path d="M6 16h52v6L32 38 6 22z" fill="#fff" opacity="0.25" />
    </svg>
  )
}

export function Book() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="bk" from="#a0ffd0" mid="#25d38a" to="#129c66" />
      <Shadow />
      <rect x="12" y="8" width="40" height="48" rx="4" fill={`url(#bk-body)`} stroke="#0c6a45" strokeWidth="1.2" />
      <rect x="12" y="8" width="8" height="48" rx="4" fill="#0f8a5a" />
      <g fill="#eafff4" opacity="0.9">
        <rect x="26" y="20" width="20" height="3" rx="1.5" />
        <rect x="26" y="28" width="20" height="3" rx="1.5" />
        <rect x="26" y="36" width="14" height="3" rx="1.5" />
      </g>
      <ellipse cx="30" cy="18" rx="12" ry="5" fill={`url(#bk-shine)`} />
    </svg>
  )
}

export function Paint() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="pt" from="#ffffff" mid="#e6ecff" to="#b9c7ff" />
      <Shadow />
      <path d="M32 8a24 22 0 1 0 6 43c4-1 2-6 5-8s7 1 9-3A24 22 0 0 0 32 8z" fill={`url(#pt-body)`} stroke="#2536d6" strokeWidth="1.2" />
      <circle cx="22" cy="26" r="4" fill="#ff3ea5" />
      <circle cx="34" cy="20" r="4" fill="#00e5ff" />
      <circle cx="44" cy="30" r="4" fill="#39ff88" />
      <circle cx="26" cy="40" r="4" fill="#2530ff" />
      <ellipse cx="26" cy="20" rx="12" ry="6" fill={`url(#pt-shine)`} />
    </svg>
  )
}

export function Github() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="gh" from="#4a4f5c" mid="#24272e" to="#0e1013" />
      <Shadow />
      <circle cx="32" cy="32" r="26" fill={`url(#gh-body)`} stroke="#000" strokeWidth="1" />
      <path
        fill="#fff"
        d="M32 15c-9.4 0-17 7.6-17 17 0 7.5 4.9 13.9 11.6 16.1.8.15 1.1-.37 1.1-.82v-2.9c-4.7 1-5.7-2-5.7-2-.8-2-1.9-2.5-1.9-2.5-1.6-1 .12-1 .12-1 1.7.12 2.6 1.7 2.6 1.7 1.5 2.6 4 1.8 5 1.4.15-1.1.6-1.8 1.1-2.2-3.8-.43-7.7-1.9-7.7-8.4 0-1.9.66-3.4 1.7-4.6-.17-.43-.75-2.1.17-4.5 0 0 1.4-.45 4.7 1.7a16 16 0 0 1 8.6 0c3.3-2.2 4.7-1.7 4.7-1.7.92 2.3.34 4 .17 4.5 1.1 1.2 1.7 2.7 1.7 4.6 0 6.5-3.9 8-7.7 8.4.6.53 1.1 1.5 1.1 3.1v4.6c0 .45.3.98 1.15.81A17 17 0 0 0 49 32c0-9.4-7.6-17-17-17z"
      />
      <ellipse cx="24" cy="20" rx="14" ry="7" fill="#fff" opacity="0.18" />
    </svg>
  )
}

export function Linkedin() {
  return (
    <svg viewBox="0 0 64 64" className="ic3d">
      <Defs id="li" from="#3f9be0" mid="#0a66c2" to="#054a91" />
      <Shadow />
      <rect x="8" y="8" width="48" height="48" rx="10" fill={`url(#li-body)`} stroke="#043b73" strokeWidth="1" />
      <g fill="#fff">
        <rect x="16" y="26" width="7" height="22" rx="1" />
        <circle cx="19.5" cy="19" r="4" />
        <path d="M28 26h7v3c1-2 3.4-3.6 6.6-3.6 6 0 8.4 3.7 8.4 9.6V48h-7V36c0-2.8-1-4.6-3.5-4.6-2 0-3 1.3-3.5 2.6-.2.5-.2 1.1-.2 1.8V48h-7z" />
      </g>
      <rect x="10" y="10" width="44" height="16" rx="8" fill="#fff" opacity="0.16" />
    </svg>
  )
}

export const ICONS = {
  paint: Paint,
  folder: Folder,
  file: FileDoc,
  envelope: Envelope,
  book: Book,
  github: Github,
  linkedin: Linkedin,
}
