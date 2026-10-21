import { useEffect, useRef, useState } from 'react'
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
 * in the browser from inside the site's own markup — so the squiggle always
 * matches the word above it, whatever the theme's colours are and wherever the
 * page's styles are set. It is measured again whenever styles arrive or change
 * anywhere on the page — a stylesheet loading late, or colours being edited
 * live in the Uniweb app. Any colour that can't be measured (the prerendered
 * page, styles that haven't arrived yet) is worked out from the theme data
 * instead, so there is always a squiggle.
 */
const PAIRS = [
  ['squiggle', 'context-light'],
  ['squiggle-bright', 'context-dark'],
  ['squiggle-on-brand', 'tone tone-brand'],
]

/** The colour --accent-ink comes to inside an element of this class, placed in `host`, as a hex. */
function measure(host, className, ctx) {
  const probe = document.createElement('div')
  probe.className = className
  probe.hidden = true
  host.append(probe)
  const value = getComputedStyle(probe).getPropertyValue('--accent-ink').trim()
  probe.remove()
  if (!value || value.includes('var(')) return null
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = 'transparent'
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return a ? `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}` : null
}

export default function Squiggles() {
  const theme = useThemeData()
  const anchor = useRef(null)
  const [measured, setMeasured] = useState({})

  useEffect(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    let timer = 0
    let observer = null
    const update = () => {
      timer = 0
      const host = anchor.current?.parentElement || document.body
      const next = Object.fromEntries(PAIRS.map(([name, className]) => [name, measure(host, className, ctx)]))
      // The probes are changes to the page too: drop them, or this would
      // run itself forever.
      observer?.takeRecords()
      setMeasured((prev) => (PAIRS.every(([name]) => prev[name] === next[name]) ? prev : next))
    }
    // A timer rather than an animation frame: frames don't run in a hidden
    // tab or a background preview.
    const schedule = () => { if (!timer) timer = setTimeout(update, 50) }
    update()

    // Styles that arrive or change later, wherever they are set: a <style> or
    // <link> added or rewritten, or a style/class attribute changed on any
    // element (an editor setting colours on the page or a wrapper)…
    observer = new MutationObserver(schedule)
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    // …and a stylesheet that finishes loading after it was added.
    document.addEventListener('load', schedule, true)
    return () => {
      observer.disconnect()
      document.removeEventListener('load', schedule, true)
      clearTimeout(timer)
    }
  }, [])

  // From the theme data: a var may name another (`on-brand-accent: var(--ink)`)
  // or shades of the theme's palettes (`brand: var(--primary-500)`, or a
  // color-mix of two) — put each in place until only colours are left.
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
  const fromTheme = {
    squiggle: resolve('var(--brand)'),
    'squiggle-bright': resolve('var(--accent-on-ink)'),
    'squiggle-on-brand': resolve('var(--on-brand-accent)'),
  }

  const css = PAIRS.map(([name]) => [name, measured[name] || fromTheme[name]])
    .filter(([, colour]) => colour)
    .map(([name, colour]) => `--${name}:${squiggle(colour)};`)
    .join('')
  return (
    <>
      <span ref={anchor} hidden />
      <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />
    </>
  )
}
