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
  // public/resume.pdf — exported from the .docx; re-export over it to update.
  // (set to null to swap the menu bar button for a "resume · soon" placeholder)
  resume: '/resume.pdf',
  github: 'https://github.com/Nan0dev06',
}

// the bio the terminal types out, character by character — kept verbatim from
// the real terminal-portfolio (TypingText in portfolio.py) so the two match
export const terminalBio = `Nour Al Shami is a computer science student at USAL, building toward AI Engineering.

Drawn to machine perception, computer vision, and creative sides of code.

When not coding, she is deep in game lore or failing to teach her cat new tricks.

Currently exploring the world of humanoid robotics and AI research.`

// the line at the top of the projects window
export const tagline = "I build software that solves real people's problems."

// One card per project, in display order. Everything here shows on the card
// with no extra clicks. A null field just hides that bit of the card.
//   pitch  — one line: who it's for + the problem it solves
//   role   — what i actually did (keep this honest)
//   result — one concrete outcome
//   image  — screenshot in /public/projects/ (null → placeholder tile)
// Facts and screenshots here are taken from each repo's README — keep the two
// in sync, a recruiter can click straight through from the card to the repo.
export const projects = [
  {
    name: 'Nudgy',
    pitch: "for friend groups that can never agree on a time — an AI agent that reads everyone's live calendars, proposes a time and a place, polls the group, and books it.",
    role: 'designed the product and architecture; built with an AI coding agent.',
    tags: ['fastapi', 'groq · llama 3.3 70b', 'google calendar api', 'react'],
    result: 'gold, Kanz AI hackathon',
    demo: 'https://nudgy.onrender.com',
    github: 'https://github.com/Nan0dev06/Nudgy_Shared_Calendar_Ai_Agent',
    image: '/projects/nudgy.webp',
  },
  {
    name: 'Check On',
    pitch: 'for older adults and their family caregivers — links a new symptom back to the medicine that started it, before it gets treated with yet another drug.',
    role: 'designed the product and architecture; built with an AI coding agent.',
    // no postgres here: the repo's store is in-memory (see its README)
    tags: ['fastapi', 'react', 'openfda faers', 'scikit-learn'],
    result: 'PRR 3.5 across 8,545 FDA reports', // the amlodipine → swollen-ankles cascade in the README
    demo: 'https://check-on.onrender.com',
    github: 'https://github.com/Nan0dev06/check-on',
    image: '/projects/check-on.webp',
  },
  {
    name: 'ClearHead',
    pitch: 'for students and professionals hitting cognitive overload — turns a chaotic brain dump into a guided focus path, one small step at a time.',
    role: 'led frontend, ui/ux and product direction in a 2-person team.',
    tags: ['react', 'fastapi', 'qwen2.5-72b', 'chrome extension'],
    result: 'finalist, USAII Global AI Hackathon 2026',
    demo: null, // no hosted demo — the README only has local setup
    github: 'https://github.com/Nan0dev06/ClearHead',
    image: '/projects/clearhead.webp',
  },
  {
    name: 'Café Lumière',
    pitch: 'for a small café owner — a desktop app to take orders, track ingredient stock, and review daily revenue.',
    role: 'designed the class hierarchy and built the central controller and revenue reporting, in a team of 3.',
    tags: ['java', 'swing', 'xchart'],
    result: null, // course project (OOP, USAL) — no headline result to claim
    demo: null, // desktop app: run it from the repo
    github: 'https://github.com/Nan0dev06/Coffee_Shop_Managment_System',
    image: '/projects/cafe-lumiere.webp',
  },
]
