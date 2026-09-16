/**
 * Colour blocks. A section with `tone:` in its frontmatter is set entirely in
 * that colour — see `.tone-*` in styles.css. Anything else (or nothing) leaves
 * the section on its theme context.
 */
export const TONES = ['vermilion', 'green', 'marigold', 'ink']

export const toneParam = {
  type: 'select',
  label: 'Colour block',
  description: 'Set the whole section in one of the house colours. Leave empty to follow the section theme.',
  options: [
    { value: '', label: 'None — follow the theme' },
    { value: 'vermilion', label: 'Vermilion' },
    { value: 'green', label: 'Bottle green' },
    { value: 'marigold', label: 'Marigold' },
    { value: 'ink', label: 'Ink' },
  ],
  default: '',
}

export function toneClass(tone) {
  return TONES.includes(tone) ? `tone tone-${tone}` : ''
}
