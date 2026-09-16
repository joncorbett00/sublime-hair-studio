/**
 * Colour blocks. A section with `tone:` in its frontmatter is set entirely in
 * that colour — see `.tone-*` in styles.css. Anything else (or nothing) leaves
 * the section on its theme context.
 */
export const TONES = ['vermilion', 'ink', 'sand']

export const toneParam = {
  type: 'select',
  label: 'Colour block',
  description: 'Set the whole section in vermilion (the one loud colour), ink or sand. Leave empty to follow the section theme.',
  options: [
    { value: '', label: 'None — follow the theme' },
    { value: 'vermilion', label: 'Vermilion' },
    { value: 'ink', label: 'Ink' },
    { value: 'sand', label: 'Sand' },
  ],
  default: '',
}

export function toneClass(tone) {
  return TONES.includes(tone) ? `tone tone-${tone}` : ''
}
