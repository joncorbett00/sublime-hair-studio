import { useEffect, useState } from 'react'
import { useThemeData } from '@uniweb/kit'
import { squiggle } from '#utils/squiggle.js'

/**
 * The squiggle under an accent word, drawn in the same colour as the word.
 *
 * An SVG in a data URL cannot read a CSS variable, so each colour it is drawn
 * in is its own image — and a theme var may not hold a data URL, so the images
 * are made here and written onto :root as --squiggle, --squiggle-bright and
 * --squiggle-on-brand (read in styles.css). Rendered by the Header, so it is on
 * every page.
 *
 * Each colour is the --accent-ink a context resolves to (styles.css), measured
 * in the browser — so the squiggle always matches the word above it, whatever
 * the theme's colours are. The prerendered page gets a first guess from the
 * theme data; a colour that can't be worked out there is left out (no
 * squiggle) rather than guessed.
 */
const PAIRS = [
  ['squiggle', 'context-light'],
  ['squiggle-bright', 'context-dark'],
  ['squiggle-on-brand', 'tone tone-brand'],
]

/** The colour the page's --accent-ink comes to inside an element of this class, as a hex. */
function measure(className, ctx) {
  const probe = document.createElement('div')
  probe.className = className
  probe.hidden = true
  document.body.append(probe)
  const value = getComputedStyle(probe).getPropertyValue('--accent-ink').trim()
  probe.remove()
  if (!value) return null
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return a ? `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}` : null
}

export default function Squiggles() {
  const theme = useThemeData()
  const [measured, setMeasured] = useState(null)

  useEffect(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    setMeasured(Object.fromEntries(PAIRS.map(([name, className]) => [name, measure(className, ctx)])))
  }, [])

  // The first guess, from the theme data: a var may name another
  // (`on-brand-accent: var(--ink)`) or shades of the theme's palettes
  // (`brand: var(--primary-500)`, or a color-mix of two) — put each in place until
  // only colours are left.
  const lookup = (name) => {
    const shade = name.match(/^(\w+)-(\d+)$/)
    return (shade && theme?.getColor?.(shade[1], Number(shade[2]))) || theme?.getFoundationVar?.(name)
  }
  const resolve = (value) => {
    for (let i = 0; i < 4 && typeof value === 'string' && value.includes('var('); i++) {
      value = value.replace(/var\(--([\w-]+)\)/g, (ref, n) => lookup(n) || ref)
    }
    return typeof value === 'string' && value && !value.includes('var(') ? value : null
  }
  const guessed = {
    squiggle: resolve('var(--brand)'),
    'squiggle-bright': resolve('var(--accent-on-ink)'),
    'squiggle-on-brand': resolve('var(--on-brand-accent)'),
  }

  const colours = measured || guessed
  const css = PAIRS.filter(([name]) => colours[name])
    .map(([name]) => `--${name}:${squiggle(colours[name])};`)
    .join('')
  return <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />
}
