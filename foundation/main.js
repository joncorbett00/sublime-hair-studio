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

// Plain vars, not `type: 'color'`: a colour-typed var is resolved per
// light/dark context at runtime, and these must be on :root in the
// prerendered page — the tone blocks, shadows and ::selection read them
// whatever the context.
const color = (value, description) => ({ default: value, group: 'House colours', description })

// A shade of the theme's neutral palette, or `pct`% of the way from one shade
// to the next.
const neutral = (a, b, pct) =>
  b ? `color-mix(in oklch, var(--neutral-${a}), var(--neutral-${b}) ${pct}%)` : `var(--neutral-${a})`

export const vars = {
  'header-height': { default: '5.5rem', description: 'Fixed header bar height, under the edge along the top' },
  'max-content-width': { default: '84rem', description: 'Outer content width' },
  'section-padding-y': { default: 'clamp(4.5rem, 9vw, 8.5rem)', description: 'Vertical section padding' },
  'section-padding-x': { default: '1.5rem', description: 'Horizontal section padding' },

  'label-stretch': {
    default: '100%',
    description: 'Width of the capital-letter labels, buttons and nav — 100% is the body face as it is; 125% sets them in Archivo’s wide cut, which reads as a face of its own.',
  },

  'section-numbers': {
    type: 'select',
    label: 'Section numbers',
    description: 'The italic "No. 01" before each section’s label.',
    options: [{ value: 'inline', label: 'Show' }, { value: 'none', label: 'Hide' }],
    default: 'inline',
  },

  'display-stretch': {
    default: '100%',
    description: 'Width of the headline face — 100% is the face as it is; with a variable-width face like Archivo, 87.5% sets headlines in its semi-condensed cut and 112.5% in its semi-expanded one.',
  },

  'font-display': {
    default: "'Archivo', ui-sans-serif, system-ui, sans-serif",
    description: 'Face for headlines, numbers and prices.',
  },

  'font-logo': {
    default: "'Bodoni Moda', 'Didot', ui-serif, Georgia, serif",
    description: 'Face for the letter in the middle of the turning seal and the wordmark set in type. Set per site as `logo:` under `fonts:` in theme.yml.',
  },

  // The neutrals — read from the neutral palette the theme generates from
  // `colors.neutral`, so changing that one colour changes the page, the
  // blocks and the text with it. A site may still pin any of them under `vars:`.
  ink: color(neutral(900, 950, 50), 'Near-black: headings on paper, the dark blocks, shadows'),
  paper: color(neutral(50, 100, 25), 'The page'),
  sand: color(neutral(100, 200, 75), 'The sand block'),

  // The one loud colour and the shades cut from it — all read from the
  // primary palette the theme generates from `colors.primary`, so changing
  // that one colour changes every one of these. A site may still pin any of
  // them under `vars:`.
  brand: color('var(--primary-500)', 'The one loud colour: whole sections, buttons, the seal, the edge along the top'),
  'brand-bright': color('var(--primary-400)', 'Lifted, for text on ink'),
  'brand-deep': color('var(--primary-600)', 'Deepened, for text on paper — accent words, eyebrow rules'),
  'brand-deeper': color('color-mix(in oklch, var(--primary-600), var(--primary-700) 25%)', 'A touch deeper again, for text on sand'),
  'brand-shade': color('color-mix(in oklch, var(--primary-500), var(--primary-600))', 'Cards inside a brand block'),
  'brand-lift': color('color-mix(in oklch, var(--primary-500), var(--primary-400))', 'Button hover on ink'),
  'on-brand': color('var(--primary-50)', 'Reading text on a brand block'),
  'on-brand-soft': color('var(--primary-200)', 'Secondary text on a brand block'),
  'accent-on-ink': color('var(--brand)', 'The accent word on ink — the brand colour; a site with a dark brand colour lifts it (`var(--brand-bright)`) so it reads'),
  'on-brand-accent': color('var(--ink)', 'The accent word on a brand block'),
  'on-brand-ring': color('var(--paper)', 'Keyboard focus ring on a brand block'),
  'seal-letter': color('var(--paper)', 'The letter at the middle of the turning seal'),

  // The ink and sand blocks.
  'ink-card': color(neutral(900, 950, 25), 'Cards on an ink block'),
  'ink-muted': color(neutral(800, 900, 75), 'Hover and zebra rows on an ink block'),
  'ink-border': color(neutral(800, 900, 25), 'Rules on an ink block'),
  'ink-body': color(neutral(200, 300, 25), 'Reading text on an ink block'),
  'ink-subtle': color(neutral(400, 500, 25), 'Secondary text on an ink block'),
  'sand-card': color(neutral(100), 'Cards on a sand block'),
  'sand-muted': color(neutral(200, 300, 25), 'Hover and zebra rows on a sand block'),
  'sand-border': color(neutral(300), 'Rules on a sand block'),
  'sand-body': color(neutral(800), 'Reading text on a sand block'),
  'sand-subtle': color(neutral(600, 700, 50), 'Secondary text on a sand block'),
}

export default {
  name: '@studio/sublime',
  description: 'Section types for Sublime Hair Studio and Bijou Boutique — fashion-magazine polish on a colourful little salon, and a curated vintage and designer boutique.',
  defaultSection: 'Section',
  viewTransitions: true,
}
