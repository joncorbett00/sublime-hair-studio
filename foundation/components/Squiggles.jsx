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

  // A var may name another (`on-brand-accent: var(--ink)`) or shades of the
  // theme's palette (`brand-deep: var(--primary-600)`, or a color-mix of
  // two): put each in place until only colours are left.
  const lookup = (name) => {
    const shade = name.match(/^(\w+)-(\d+)$/)
    return (shade && theme?.getColor(shade[1], Number(shade[2]))) || theme?.getFoundationVar(name)
  }
  const resolve = (name, fallback) => {
    let value = lookup(name)
    for (let i = 0; i < 3 && typeof value === 'string' && value.includes('var('); i++) {
      value = value.replace(/var\(--([\w-]+)\)/g, (ref, n) => lookup(n) || ref)
    }
    return typeof value === 'string' && value && !value.includes('var(') ? value : fallback
  }

  const css = PAIRS.map(([name, from, fallback]) => `--${name}:${squiggle(resolve(from, fallback))};`).join('')
  return <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />
}
