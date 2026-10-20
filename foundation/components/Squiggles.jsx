import { useThemeData } from '@uniweb/kit'
import { squiggle } from '#utils/squiggle.js'

/**
 * The squiggle under an accent word, drawn in the site's own brand colours.
 *
 * An SVG in a data URL cannot read a CSS variable, so each colour it is drawn
 * in is its own image — and a theme var may not hold a data URL, so the images
 * are made here, from the brand vars, and written onto :root as --squiggle,
 * --squiggle-bright and --squiggle-on-brand (read in styles.css). Rendered by
 * the Header, so it is on every page and in the prerendered HTML.
 */
const PAIRS = [
  ['squiggle', 'brand-deep', '#B5391B'],
  ['squiggle-bright', 'brand-bright', '#E2582F'],
  ['squiggle-on-brand', 'on-brand-accent', '#17120F'],
]

export default function Squiggles() {
  const theme = useThemeData()

  // A var may name another (`on-brand-accent: var(--ink)`): follow it to a hex.
  const hex = (name, fallback) => {
    let value = theme?.getFoundationVar(name)
    for (let i = 0; i < 3 && typeof value === 'string'; i++) {
      const ref = value.match(/^var\(--([\w-]+)\)$/)
      if (!ref) break
      value = theme.getFoundationVar(ref[1])
    }
    return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback
  }

  const css = PAIRS.map(([name, from, fallback]) => `--${name}:${squiggle(hex(from, fallback))};`).join('')
  return <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />
}
