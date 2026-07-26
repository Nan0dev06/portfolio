import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import portraitRaw from './portrait.txt?raw'
import { profile, terminalBio } from './data'

// the file is CRLF on disk; the \r survives ?raw and adds a phantom column
const portrait = portraitRaw.replace(/\r/g, '').trimEnd()

// ─── the real terminal-portfolio, re-created ─────────────────────────────────
// Source of truth: github.com/Nan0dev06/terminal-portfolio — Python + Textual,
// served over SSH. That stack can't run in a browser, so this mirrors the TUI
// itself: binary header, ASCII portrait, figlet title with twinkling stars,
// typing bio, links that appear once typing finishes, footer keybinds, and the
// six switchable themes. Everything below is kept in step with portfolio.py.

const HOST = 'nano@nanoterminal'

// "Hello World" — the .header-binary static in portfolio.py
const BINARY =
  '01001000 01100101 01101100 01101100 01101111 00100000 ' +
  '01010111 01101111 01110010 01101100 01100100'

// pyfiglet.figlet_format('Nano', font='slant')
const FIGLET = [
  '    _   __                ',
  '   / | / /___ _____  ____ ',
  '  /  |/ / __ `/ __ \\/ __ \\',
  ' / /|  / /_/ / / / / /_/ /',
  '/_/ |_/\\__,_/_/ /_/\\____/ ',
].join('\n')

// TitleWithStars: a 3×25 grid where only these cells ever twinkle
const STAR_POSITIONS = [
  [0, 5],
  [0, 15],
  [1, 2],
]
const STAR_CHARS = ['*', '.', '+', '`', ' ', ' ']
const STAR_ROWS = 3
const STAR_COLS = 25

// the Textual themes portfolio.py cycles with `t`, nano-green first
const THEMES = [
  { name: 'nano-green', bg: '#0D0208', fg: '#00FF41', dim: '#008F11', accent: '#00FF41' },
  { name: 'nord', bg: '#2E3440', fg: '#D8DEE9', dim: '#4C566A', accent: '#88C0D0' },
  { name: 'gruvbox', bg: '#282828', fg: '#EBDBB2', dim: '#928374', accent: '#FABD2F' },
  { name: 'tokyo-night', bg: '#1A1B26', fg: '#A9B1D6', dim: '#565F89', accent: '#7AA2F7' },
  { name: 'textual-dark', bg: '#1E1E1E', fg: '#E0E0E0', dim: '#7F7F7F', accent: '#0178D4' },
  { name: 'atom-one-dark', bg: '#282C34', fg: '#ABB2BF', dim: '#5C6370', accent: '#61AFEF' },
]

// The TUI is a fixed-width character grid, like Textual's `min-width: 100`.
// os.css pins it to exactly this many columns (65 portrait + 2 gutter + 40
// right panel), so the only free variable is the font size — pick the one that
// makes those columns fill the window instead of overflowing or leaving a gap.
const TUI_COLS = 107
// on a phone, fitting all 107 columns lands around a 6px font — unreadable.
// Below this width os.css drops the portrait column and only the right panel
// (42 cols) has to fit, which brings the text back to a legible size.
const NARROW_PX = 520
const NARROW_COLS = 42

// width of one `ch` at the element's current font size. Measured rather than
// derived from an assumed em ratio — that varies per monospace font, and the
// grid is laid out in `ch`, so this is the unit that actually governs it.
function measureCh(el) {
  const probe = document.createElement('div')
  // position:fixed keeps the probe out of .tui's scroll area — as an absolute
  // child it inflated scrollWidth, raised a scrollbar, and shrank the very
  // clientWidth we're fitting to, which re-fired the observer in a loop
  probe.style.cssText =
    'position:fixed;top:0;left:-9999px;visibility:hidden;pointer-events:none;width:1000ch'
  el.appendChild(probe)
  // offsetWidth, not getBoundingClientRect: the window's open animation scales
  // its subtree, and a scaled rect would make ch read small and the font
  // overshoot. offsetWidth ignores transforms, matching clientWidth above.
  const ch = probe.offsetWidth / 1000
  probe.remove()
  return ch
}

function useFitFontSize(ref) {
  const [fit, setFit] = useState({ fontSize: 10, narrow: false })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const avail = el.clientWidth
      const ch = measureCh(el)
      if (!avail || !ch) return
      const narrow = avail < NARROW_PX
      const cols = narrow ? NARROW_COLS : TUI_COLS
      // ch scales linearly with font-size, so this lands exactly in one pass
      const cur = parseFloat(getComputedStyle(el).fontSize)
      setFit({ fontSize: Math.max(3.5, Math.min(16, (cur * avail) / (cols * ch))), narrow })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return fit
}

function Stars() {
  const [grid, setGrid] = useState('')
  useEffect(() => {
    const roll = () => {
      const rows = Array.from({ length: STAR_ROWS }, () => Array(STAR_COLS).fill(' '))
      for (const [r, c] of STAR_POSITIONS)
        rows[r][c] = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)]
      setGrid(rows.map((r) => r.join('')).join('\n'))
    }
    roll()
    const t = setInterval(roll, 500)
    return () => clearInterval(t)
  }, [])
  return <pre className="tui-stars">{grid}</pre>
}

// TypingText: 1 char every 30ms, then the links become visible
function TypingBio({ onDone, skip }) {
  const [n, setN] = useState(0)
  const done = n >= terminalBio.length

  useEffect(() => {
    if (skip) return setN(terminalBio.length)
    const t = setInterval(() => setN((v) => Math.min(v + 1, terminalBio.length)), 30)
    return () => clearInterval(t)
  }, [skip])

  useEffect(() => {
    if (done) onDone()
  }, [done, onDone])

  return <pre className="tui-bio">{terminalBio.slice(0, n)}</pre>
}

function Tui({ onQuit }) {
  const [themeIndex, setThemeIndex] = useState(0)
  const [linksVisible, setLinksVisible] = useState(false)
  const [skipTyping, setSkipTyping] = useState(false)
  const boxRef = useRef(null)
  const { fontSize, narrow } = useFitFontSize(boxRef)
  const theme = THEMES[themeIndex]

  // React ignores autoFocus on a non-form element, and without focus here the
  // `t` / `q` keybinds do nothing until you happen to click the TUI
  useEffect(() => boxRef.current?.focus({ preventScroll: true }), [])

  const onKeyDown = (e) => {
    if (e.key === 't') setThemeIndex((i) => (i + 1) % THEMES.length)
    else if (e.key === 'q') onQuit()
    else return
    e.preventDefault()
  }

  return (
    <div
      ref={boxRef}
      className={`tui ${narrow ? 'narrow' : ''}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={() => setSkipTyping(true)}
      style={{
        fontSize,
        background: theme.bg,
        color: theme.fg,
        '--tui-dim': theme.dim,
        '--tui-accent': theme.accent,
      }}
    >
      <div className="tui-binary">{BINARY}</div>

      <div className="tui-main">
        <pre className="tui-portrait">{portrait}</pre>

        <div className="tui-right">
          <Stars />
          <pre className="tui-figlet">{FIGLET}</pre>
          <TypingBio skip={skipTyping} onDone={() => setLinksVisible(true)} />

          {linksVisible && (
            <div className="tui-links">
              <div className="tui-rule">{'-'.repeat(40)}</div>
              <div>
                <b>GitHub</b>
                {'    '}
                <a href={profile.github} target="_blank" rel="noreferrer">
                  @Nan0dev06
                </a>
              </div>
              <div>
                <b>Email</b>
                {'     '}
                {profile.email}
              </div>
              <div>
                <b>LinkedIn</b>
                {'  '}
                <a
                  href="https://www.linkedin.com/in/nour-al-shami-3701a037a/"
                  target="_blank"
                  rel="noreferrer"
                >
                  /in/nour-al-shami
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tui-footer">
        <button onClick={() => setThemeIndex((i) => (i + 1) % THEMES.length)}>
          <kbd>t</kbd> Theme
        </button>
        <button onClick={onQuit}>
          <kbd>q</kbd> Quit
        </button>
        <span className="tui-theme-name">{theme.name}</span>
      </div>
    </div>
  )
}

const BOOT = [
  { text: 'nanoOS terminal · nanosh 1.0' },
  { text: "type `help` for commands." },
  { text: '' },
]

export default function Terminal() {
  // 'shell' → typing at the prompt · 'tui' → connected to the portfolio
  const [mode, setMode] = useState('shell')
  const [lines, setLines] = useState(BOOT)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const print = (...text) => setLines((prev) => [...prev, ...text.map((t) => ({ text: t }))])

  const connect = () => {
    print(
      "The authenticity of host 'nanoterminal' can't be established.",
      "Warning: Permanently added 'nanoterminal' to the list of known hosts.",
      'connecting…'
    )
    setMode('tui')
  }

  const run = (raw) => {
    const cmd = raw.trim()
    print(`visitor@nanoos:~$ ${cmd}`)
    if (!cmd) return
    // accept the real connect command and the shorthands people will try
    if (/^ssh\s+(nano@)?\S+/i.test(cmd)) return connect()
    if (cmd === 'clear') return setLines([])
    if (cmd === 'help')
      return print(
        `  ssh ${HOST}   connect to nano's terminal portfolio`,
        '  clear                   clear the screen',
        '  help                    this list',
        ''
      )
    print(`nanosh: command not found: ${cmd.split(/\s+/)[0]}`)
  }

  const submit = (e) => {
    e.preventDefault()
    run(input)
    setInput('')
  }
  // the form covers mobile's "Go" key; the keydown covers Enter everywhere
  const onKeyDown = (e) => e.key === 'Enter' && submit(e)

  if (mode === 'tui')
    return (
      <Tui
        onQuit={() => {
          setMode('shell')
          print('Connection to nanoterminal closed.', '')
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
      />
    )

  return (
    <div className="term" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} className="term-line">
          {l.text || ' '}
        </div>
      ))}

      <button type="button" className="term-hint" onClick={connect}>
        hint: try <code>ssh {HOST}</code> ↵
      </button>

      <form className="term-prompt" onSubmit={submit}>
        <span className="term-ps1">visitor@nanoos:~$</span>
        <input
          ref={inputRef}
          className="term-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="terminal input"
        />
      </form>
    </div>
  )
}
