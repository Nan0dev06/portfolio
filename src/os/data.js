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
export const projects = [
  {
    name: 'Nudgy',
    pitch: "for groups that can never agree on a time — an agentic scheduling assistant that finds when everyone is free, runs a poll, and books it on every calendar.",
    role: 'designed the product and architecture; built with an AI coding agent.',
    tags: ['fastapi', 'groq · llama 3.3 70b', 'google calendar api', 'react'],
    result: 'gold, Kanz AI hackathon',
    demo: null, // TODO: live demo URL, if there is one
    github: 'https://github.com/Nan0dev06/Nudgy_Shared_Calendar_Ai_Agent',
    image: null, // TODO: add public/projects/nudgy.png, then set this to '/projects/nudgy.png'
  },
  {
    name: 'Check On',
    pitch: 'for elderly people on several medications — detects prescribing cascades, where a new symptom is really a side effect of an earlier drug, before the next prescription is written.',
    role: 'designed the product and architecture; built with an AI coding agent.',
    tags: ['fastapi', 'postgres', 'react', 'openfda faers', 'scikit-learn'],
    result: null, // TODO: one concrete result (a number, a test outcome, a placement)
    demo: 'https://check-on.onrender.com',
    github: 'https://github.com/Nan0dev06/check-on',
    image: null, // TODO: add public/projects/check-on.png, then set this to '/projects/check-on.png'
  },
  {
    name: 'ClearHead',
    pitch: 'for people overloaded by vague goals — an AI cognitive-load manager that turns them into milestone-based plans and tracks real-time distraction during work sessions.',
    role: 'led the frontend and product side.',
    tags: ['react', 'llm', 'chrome extension'],
    result: 'finalist, USAII Global AI Hackathon 2026',
    demo: null, // TODO: live demo URL, if there is one
    github: 'https://github.com/Nan0dev06/ClearHead',
    image: null, // TODO: add public/projects/clearhead.png, then set this to '/projects/clearhead.png'
  },
]
