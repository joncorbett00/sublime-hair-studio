/**
 * The Sublime foundation — section types for Sublime Hair Studio and its
 * sister, Bijou Boutique. Both sites use every section type here; what makes
 * one Sublime's "Front Row" and the other Bijou's "Curated Apparel" is
 * settings, not code:
 *
 *   - colour: the vars below, set per site under `vars:` in theme.yml
 *   - motifs: section params — `edge` on Header/Footer (selvedge or film
 *     strip), `frame` on Hero/SplitContent (arch, film gate or square),
 *     `seal` on Hero (ring or film reel), caption words, and so on
 *
 * Foundation vars are the values that must agree ACROSS section types —
 * the header height, the content width, the section rhythm, the house
 * colours. Anything that belongs to one section lives in that section's
 * meta.js instead. The defaults are Sublime's.
 */

// The accent squiggle is an SVG, and an SVG in a data URL cannot read a CSS
// variable, so each colour it is drawn in is its own image.
const squiggle = (hex) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M3 8c9.5-5.3 17.5-5.3 28.5 0s19 5.3 28.5 0 19-5.3 28.5 0 19 5.3 28.5 0' fill='none' stroke='%23${hex.slice(1)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`

// Plain vars, not `type: 'color'`: a colour-typed var is resolved per
// light/dark context at runtime, and these must be on :root in the
// prerendered page — the tone blocks, shadows and ::selection read them
// whatever the context.
const color = (value, description) => ({ default: value, group: 'House colours', description })
const image = (value, description) => ({ default: value, group: 'House colours', description })

export const vars = {
  'header-height': { default: '5.5rem', description: 'Fixed header bar height, under the edge along the top' },
  'max-content-width': { default: '84rem', description: 'Outer content width' },
  'section-padding-y': { default: 'clamp(4.5rem, 9vw, 8.5rem)', description: 'Vertical section padding' },
  'section-padding-x': { default: '1.5rem', description: 'Horizontal section padding' },

  'font-display': {
    default: "'Archivo', ui-sans-serif, system-ui, sans-serif",
    description: 'Face for headlines, numbers and prices. The wordmark keeps Bodoni Moda (--font-logo in styles.css).',
  },

  // The neutrals.
  ink: color('#17120F', 'Near-black: headings on paper, the dark blocks, shadows'),
  paper: color('#F6F0E6', 'The page'),
  sand: color('#E6DBCB', 'The sand block'),

  // The one loud colour and the shades cut from it. The palette switcher
  // (components/PaletteSwitcher.jsx) overrides these on <html>.
  brand: color('#C8401F', 'The one loud colour: whole sections, buttons, the seal, the edge along the top'),
  'brand-bright': color('#E2582F', 'Lifted, for text on ink'),
  'brand-deep': color('#B5391B', 'Deepened, for text on paper — accent words, eyebrow rules'),
  'brand-deeper': color('#A8341A', 'A touch deeper again, for text on sand'),
  'brand-shade': color('#B4381A', 'Cards inside a brand block'),
  'brand-lift': color('#D9542F', 'Button hover on ink'),
  'on-brand': color('#FFF1E8', 'Reading text on a brand block'),
  'on-brand-soft': color('#F8D3C4', 'Secondary text on a brand block'),
  'on-brand-accent': color('var(--ink)', 'The accent word on a brand block'),
  'on-brand-ring': color('var(--paper)', 'Keyboard focus ring on a brand block'),
  'seal-letter': color('var(--paper)', 'The letter at the middle of the turning seal'),

  // The ink and sand blocks.
  'ink-card': color('#231C18', 'Cards on an ink block'),
  'ink-muted': color('#2E2520', 'Hover and zebra rows on an ink block'),
  'ink-border': color('#3B312B', 'Rules on an ink block'),
  'ink-body': color('#D9CEC2', 'Reading text on an ink block'),
  'ink-subtle': color('#A89A8E', 'Secondary text on an ink block'),
  'sand-card': color('#EFE7DB', 'Cards on a sand block'),
  'sand-muted': color('#DDD0BE', 'Hover and zebra rows on a sand block'),
  'sand-border': color('#CDBEAA', 'Rules on a sand block'),
  'sand-body': color('#3E352F', 'Reading text on a sand block'),
  'sand-subtle': color('#66584D', 'Secondary text on a sand block'),

  // The squiggle under an accent word, in brand-deep, brand-bright and
  // on-brand-accent. Change these with those colours.
  squiggle: image(squiggle('#B5391B'), 'Squiggle on paper and sand (brand-deep)'),
  'squiggle-bright': image(squiggle('#E2582F'), 'Squiggle on ink (brand-bright)'),
  'squiggle-on-brand': image(squiggle('#17120F'), 'Squiggle on a brand block (on-brand-accent)'),
}

export default {
  name: 'Sublime',
  description: 'Section types for Sublime Hair Studio and Bijou Boutique — fashion-magazine polish on a colourful little salon, and a curated vintage and designer boutique.',
  defaultSection: 'Section',
  viewTransitions: true,
}
