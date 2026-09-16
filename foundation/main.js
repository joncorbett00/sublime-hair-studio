/**
 * Sublime Hair Studio foundation — the "Front Row" look.
 *
 * Foundation vars are the values that must agree ACROSS section types —
 * the header height, the content width, the section rhythm, the offset of
 * the hard shadow. Anything that belongs to one section lives in that
 * section's meta.js instead.
 */
export const vars = {
  'header-height': { default: '5.5rem', description: 'Fixed header bar height, under the colour stripe' },
  'max-content-width': { default: '84rem', description: 'Outer content width' },
  'section-padding-y': { default: 'clamp(4.5rem, 9vw, 8.5rem)', description: 'Vertical section padding' },
  'section-padding-x': { default: '1.5rem', description: 'Horizontal section padding' },

  'offset': { default: '0.375rem', description: 'Hard offset shadow on buttons and framed cards' },
  'block-offset': { default: '1.25rem', description: 'How far the solid colour block sits out from behind a photo' },

  'font-display': {
    default: "'Bodoni Moda', 'Didot', ui-serif, Georgia, serif",
    description: 'High-contrast display serif for the wordmark, headlines and prices',
  },
}

export default {
  name: 'Sublime',
  description: 'Section types for Sublime Hair Studio — fashion-magazine polish on a colourful little salon.',
  defaultSection: 'Section',
  viewTransitions: true,
}
