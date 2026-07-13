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
    name: 'ClearHead',
    desc: 'an AI cognitive-load manager that turns vague goals into milestone-based plans and tracks real-time distraction during work sessions — finalist, USAII Global AI Hackathon 2026.',
    link: 'https://github.com/Nan0dev06/ClearHead',
    tags: ['react', 'llm', 'chrome extension'],
  },
  {
    name: 'terminal portfolio',
    desc: 'an ssh-able portfolio that runs live inside your terminal — no browser needed.',
    link: 'https://github.com/Nan0dev06/terminal-portfolio',
    tags: ['python', 'ssh', 'textual'],
  },
  {
    name: 'pixel portrait',
    desc: 'turns a photo into a one-color-per-block pixel grid for hand-drawn retro portraits — built for my uncle.',
    link: 'https://github.com/Nan0dev06/pixel-portrait',
    tags: ['javascript', 'canvas'],
  },
  {
    name: 'Café Lumière',
    desc: 'a Java Swing desktop app for small-business café management — order entry, inventory, and revenue reporting.',
    link: 'https://github.com/Nan0dev06/Coffee_Shop_Managment_System',
    tags: ['java', 'swing'],
  },
]
