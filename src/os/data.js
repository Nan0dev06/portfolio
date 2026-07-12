// ─── All personal content lives here — edit freely ───────────────────────────

export const profile = {
  name: 'nano', // your display name
  fullName: 'Nour', // TODO: put your full name
  title: 'developer',
  avatar: null, // TODO: put a photo in /public and set e.g. '/me.jpg'
  about: [
    "hey, i'm nano — welcome to my little corner of the internet.",
    'this is placeholder text. tell visitors who you are, what you love building, and what you are learning right now.',
  ],
  email: 'you@example.com', // TODO: your public contact email
  github: 'https://github.com/Nan0dev06',
  resumeUrl: null, // TODO: put resume.pdf in /public and set '/resume.pdf'
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
