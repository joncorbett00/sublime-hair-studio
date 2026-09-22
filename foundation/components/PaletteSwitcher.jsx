import { useEffect, useState } from 'react'

/**
 * A floating swatch picker for trying the site in another loud colour.
 *
 * The house has one colour (the `brand` var) and a family of shades cut from
 * it. Each palette names three of them — the colour, a brighter one for text
 * on ink and a deeper one for text on paper — and the rest are mixed from
 * those. `pop` is the accent word on a block of the colour, for colours too
 * dark to carry ink there (the default).
 *
 * The palettes are content: a `yaml:palettes` block in the site's header.md,
 * each { id, name, color, bright, deep, pop? }. The FIRST is the site's own
 * colour, as set in theme.yml — choosing it clears the overrides rather than
 * restating them. No block, no picker.
 *
 * Choosing one writes the tokens onto <html>, so every section, tone block,
 * button and squiggle follows. Paper, sand and ink stay as they are.
 *
 * The choice is remembered in this browser (per site), and `?palette=<id>` in
 * a link opens the site in that palette. To adopt a palette, copy its values
 * into the brand vars and `primary`/`accent` in theme.yml, then put it first.
 */
const squiggle = (hex) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M3 8c9.5-5.3 17.5-5.3 28.5 0s19 5.3 28.5 0 19-5.3 28.5 0 19 5.3 28.5 0' fill='none' stroke='%23${hex.slice(1)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`

const mix = (a, b, pct) => `color-mix(in oklch, ${a}, ${b} ${pct}%)`

function tokens({ color, bright, deep, pop }, ink) {
  pop = pop || ink
  return {
    '--brand': color,
    '--brand-bright': bright,
    '--brand-deep': deep,
    '--brand-deeper': mix(deep, 'black', 8),
    '--brand-shade': mix(color, 'black', 10),
    '--brand-lift': mix(color, 'white', 10),
    '--on-brand': mix(color, 'white', 92),
    '--on-brand-soft': mix(color, 'white', 76),
    '--squiggle': squiggle(deep),
    '--squiggle-bright': squiggle(bright),
    '--on-brand-accent': pop,
    '--squiggle-on-brand': squiggle(pop),
    /* The theme's generated scales, which drive buttons on paper and links. */
    '--primary-400': bright,
    '--primary-500': color,
    '--primary-600': mix(color, 'black', 12),
    '--primary-700': mix(color, 'black', 25),
    '--accent-400': bright,
    '--accent-500': color,
  }
}

/** The ink colour as a hex, for the default `pop` (squiggles need a hex). */
function inkHex() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
  return /^#[0-9a-f]{6}$/i.test(v) ? v : '#17120F'
}

function apply(palettes, palette) {
  const style = document.documentElement.style
  const ink = inkHex()
  // The first palette is the site's own values: clear, don't restate.
  for (const name of Object.keys(tokens(palettes[0], ink))) style.removeProperty(name)
  if (palette.id === palettes[0].id) return
  for (const [name, value] of Object.entries(tokens(palette, ink))) style.setProperty(name, value)
}

function stored(key) {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('palette')
    return fromUrl || window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export default function PaletteSwitcher({ palettes = [], storageKey = 'palette' }) {
  const PALETTES = palettes.filter((p) => p?.id && p?.color)
  const STORAGE_KEY = `${storageKey}-palette`
  const [current, setCurrent] = useState(PALETTES[0]?.id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = PALETTES.find((p) => p.id === stored(STORAGE_KEY))
    if (saved) setCurrent(saved.id)
  }, [])

  useEffect(() => {
    if (!PALETTES.length) return
    apply(PALETTES, PALETTES.find((p) => p.id === current) || PALETTES[0])
    try {
      window.localStorage.setItem(STORAGE_KEY, current)
    } catch {}
  }, [current])

  if (PALETTES.length < 2) return null

  const active = PALETTES.find((p) => p.id === current) || PALETTES[0]

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-ink">
      {open && (
        <div
          id="palette-panel"
          className="mb-2 w-56 border border-ink bg-card p-3 shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--ink)_50%,transparent)]"
        >
          <p className="caps mb-2.5 text-[0.625rem]">Palette</p>
          <ul className="grid gap-1">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(p.id)}
                  aria-pressed={p.id === current}
                  className={`flex w-full items-center gap-3 px-2 py-1.5 text-left text-sm transition-colors hover:bg-sand ${
                    p.id === current ? 'bg-sand font-semibold' : ''
                  }`}
                >
                  <span className="flex shrink-0">
                    <span className="size-5" style={{ background: p.color }} />
                    <span className="size-5" style={{ background: p.bright }} />
                  </span>
                  {p.name}
                  {p.id === PALETTES[0].id && <span className="ml-auto text-xs text-subtle">current</span>}
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
        className="flex items-center gap-2.5 border border-ink bg-card py-2 pl-2 pr-3.5 shadow-[0_16px_32px_-18px_color-mix(in_srgb,var(--ink)_50%,transparent)]"
      >
        <span className="size-5" style={{ background: active.color }} />
        <span className="caps text-[0.625rem]">{active.name}</span>
      </button>
    </div>
  )
}
