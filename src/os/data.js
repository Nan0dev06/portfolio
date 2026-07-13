// ─── All personal content lives here — edit freely ───────────────────────────

export const profile = {
  name: 'nano', // your display name
  fullName: 'Nour Al Shami',
  title: 'CS student · AI engineering, CV focus',
  avatar: null, // TODO: put a photo in /public and set e.g. '/me.jpg'
  about: [
    "hey, i'm nano — first-year CS student aiming at AI engineering with a computer vision focus.",
    "i build AI products end to end: product direction, frontend, and the applied LLM wiring that ties it together. most recently led the frontend and product side of ClearHead, an AI cognitive-load manager, to a finalist placement at the USAII Global AI Hackathon 2026.",
    'outside of that — Java Swing desktop apps, an SSH-native terminal portfolio, and whatever new idea is currently living rent-free in my head.',
  ],
  email: 'nano.06dev@gmail.com',
  github: 'https://github.com/Nan0dev06',
  resumeUrl: '/resume.pdf',
}

// languages / tech that spill out of the desktop folder
export const languages = [
  { code: 'JS', name: 'JavaScript', color: '#f7df1e', dark: true },
  { code: 'Py', name: 'Python', color: '#3776ab' },
  { code: 'C++', name: 'C++', color: '#659ad2' },
  { code: '</>', name: 'HTML/CSS', color: '#e2725b' },
  { code: 'Re', name: 'React', color: '#61dafb', dark: true },
  { code: 'SQL', name: 'SQL', color: '#8a6fbf' },
]

export const projects = [
  {
    name: 'terminal portfolio',
    desc: 'an ssh-able portfolio that runs in your terminal — no browser needed.',
    link: 'https://github.com/Nan0dev06',
    tags: ['python', 'ssh', 'textual'],
  },
  {
    name: 'this website',
    desc: 'a 3d laptop that opens into its own tiny operating system.',
    link: 'https://github.com/Nan0dev06/portfolio',
    tags: ['react', 'three.js', 'r3f'],
  },
  {
    name: 'project three',
    desc: 'placeholder — describe another project here.',
    link: null,
    tags: ['tag'],
  },
]
