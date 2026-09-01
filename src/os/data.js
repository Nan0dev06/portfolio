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

export const projects = [
  {
    name: 'ClearHead',
    desc: 'an AI cognitive-load manager that turns vague goals into milestone-based plans and tracks real-time distraction during work sessions — finalist, USAII Global AI Hackathon 2026.',
    link: 'https://github.com/Nan0dev06/ClearHead',
    tags: ['react', 'llm', 'chrome extension'],
  },
  {
    name: 'Check On',
    desc: 'catches prescribing cascades before the next prescription is written — pairs an NHANES-trained frailty baseline with live openFDA adverse-event signals, so a new symptom gets linked back to the drug that started it.',
    link: 'https://github.com/Nan0dev06/check-on',
    tags: ['python', 'openfda', 'health data'],
  },
  {
    name: 'Nudgy',
    desc: 'an agentic group scheduling assistant — finds when a group is free, proposes a time, runs a poll, and books it on everyone\'s calendar.',
    link: 'https://github.com/Nan0dev06/Nudgy_Shared_Calendar_Ai_Agent',
    tags: ['python', 'fastapi', 'llm agent'],
  },
  {
    name: 'Café Lumière',
    desc: 'a Java Swing desktop app for small-business café management — order entry, inventory, and revenue reporting.',
    link: 'https://github.com/Nan0dev06/Coffee_Shop_Managment_System',
    tags: ['java', 'swing'],
  },
]
