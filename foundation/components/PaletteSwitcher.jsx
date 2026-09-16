import { useEffect, useState } from 'react'

/**
 * A floating swatch picker for trying the site in another loud colour.
 *
 * The house has one colour (styles.css calls it `--vermilion`) and a family
 * of shades cut from it. Each palette names three of them — the colour, a
 * brighter one for text on ink and a deeper one for text on paper — and the
 * rest are mixed from those. `pop` is the accent word on a block of the
 * colour, for colours too dark to carry ink there (the default).
 *
 * Choosing one writes the tokens onto <html>, so every section, tone block,
 * button and squiggle follows. Paper, sand and ink stay as they are.
 *
 * The choice is remembered in this browser, and `?palette=cobalt` in a link
 * opens the site in that palette. To remove the picker, delete it from
 * Header/index.jsx; to adopt a palette, copy its values into `:root` in
 * styles.css and `primary`/`accent` in site/theme.yml.
 */
export const PALETTES = [
  { id: 'vermilion', name: 'Vermilion', color: '#C8401F', bright: '#E2582F', deep: '#B5391B' },
  { id: 'fuchsia', name: 'Fuchsia', color: '#C21E6A', bright: '#EC5A9A', deep: '#AE1A5F' },
  { id: 'oxblood', name: 'Oxblood', color: '#7E1F2A', bright: '#D8606F', deep: '#7E1F2A', pop: '#F4B6BE' },
  { id: 'plum', name: 'Plum', color: '#6F2C66', bright: '#C570B7', deep: '#6F2C66', pop: '#EBC0E3' },
  { id: 'cobalt', name: 'Cobalt', color: '#2F45C8', bright: '#7389F7', deep: '#2A3EB5', pop: '#C9D2FF' },
  { id: 'petrol', name: 'Petrol', color: '#0E6C73', bright: '#3BB4BD', deep: '#0D6168', pop: '#A9E3E7' },
  { id: 'emerald', name: 'Emerald', color: '#1E6E50', bright: '#43B78B', deep: '#1B6448', pop: '#B4E6CF' },
]

const STORAGE_KEY = 'sublime-palette'

const squiggle = (hex) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M3 8c9.5-5.3 17.5-5.3 28.5 0s19 5.3 28.5 0 19-5.3 28.5 0 19 5.3 28.5 0' fill='none' stroke='%23${hex.slice(1)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`

const mix = (a, b, pct) => `color-mix(in oklch, ${a}, ${b} ${pct}%)`

function tokens({ color, bright, deep, pop = '#17120F' }) {
  return {
    '--vermilion': color,
    '--vermilion-bright': bright,
    '--vermilion-deep': deep,
    '--vermilion-deeper': mix(deep, 'black', 8),
    '--vermilion-shade': mix(color, 'black', 10),
    '--vermilion-lift': mix(color, 'white', 10),
    '--on-vermilion': mix(color, 'white', 92),
    '--on-vermilion-soft': mix(color, 'white', 76),
    '--squiggle': squiggle(deep),
    '--squiggle-bright': squiggle(bright),
    '--on-vermilion-accent': pop,
    '--squiggle-ink': squiggle(pop),
    /* The theme's generated scales, which drive buttons on paper and links. */
    '--primary-400': bright,
    '--primary-500': color,
    '--primary-600': mix(color, 'black', 12),
    '--primary-700': mix(color, 'black', 25),
    '--accent-400': bright,
    '--accent-500': color,
  }
}

function apply(palette) {
  const style = document.documentElement.style
  const all = tokens(PALETTES[0])
  // The default palette is the stylesheet's own values: clear, don't restate.
  for (const name of Object.keys(all)) style.removeProperty(name)
  if (palette.id === PALETTES[0].id) return
  for (const [name, value] of Object.entries(tokens(palette))) style.setProperty(name, value)
}

function stored() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('palette')
    return fromUrl || window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export default function PaletteSwitcher() {
  const [current, setCurrent] = useState(PALETTES[0].id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = PALETTES.find((p) => p.id === stored())
    if (saved) setCurrent(saved.id)
  }, [])

  useEffect(() => {
    apply(PALETTES.find((p) => p.id === current) || PALETTES[0])
    try {
      window.localStorage.setItem(STORAGE_KEY, current)
    } catch {}
  }, [current])

  const active = PALETTES.find((p) => p.id === current) || PALETTES[0]

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-[#17120F]">
      {open && (
        <div
          id="palette-panel"
          className="mb-2 w-56 border border-[#17120F] bg-[#FFFCF6] p-3 shadow-[0_24px_48px_-24px_rgb(23_18_15/0.5)]"
        >
          <p className="caps mb-2.5 text-[0.625rem]">Palette</p>
          <ul className="grid gap-1">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(p.id)}
                  aria-pressed={p.id === current}
                  className={`flex w-full items-center gap-3 px-2 py-1.5 text-left text-sm transition-colors hover:bg-[#ECE3D6] ${
                    p.id === current ? 'bg-[#ECE3D6] font-semibold' : ''
                  }`}
                >
                  <span className="flex shrink-0">
                    <span className="size-5" style={{ background: p.color }} />
                    <span className="size-5" style={{ background: p.bright }} />
                  </span>
                  {p.name}
                  {p.id === PALETTES[0].id && <span className="ml-auto text-xs text-[#6F6259]">current</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="palette-panel"
        className="flex items-center gap-2.5 border border-[#17120F] bg-[#FFFCF6] py-2 pl-2 pr-3.5 shadow-[0_16px_32px_-18px_rgb(23_18_15/0.5)]"
      >
        <span className="size-5" style={{ background: active.color }} />
        <span className="caps text-[0.625rem]">{active.name}</span>
      </button>
    </div>
  )
}
