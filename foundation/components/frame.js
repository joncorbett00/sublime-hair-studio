/**
 * Photo frames — the `frame` setting on every section with a matted photo.
 * See `.arch`, `.gate` and `.oval` in styles.css; `rounded` is the plain
 * square mat (square because the site's `radius` is 0).
 */
export const FRAMES = ['arch', 'gate', 'oval']

export const frameParam = (defaultValue = 'rounded') => ({
  type: 'select',
  label: 'Photo frame',
  options: [
    { value: 'rounded', label: 'Square' },
    { value: 'gate', label: 'Rounded rectangle' },
    { value: 'arch', label: 'Arched window' },
    { value: 'oval', label: 'Oval' },
  ],
  default: defaultValue,
})

/** The class a `.mat` takes for a frame; '' for the square one. */
export function frameClass(frame) {
  return FRAMES.includes(frame) ? frame : ''
}
