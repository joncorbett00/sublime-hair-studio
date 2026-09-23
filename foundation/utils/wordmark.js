/** The wordmark's words, shared by Header, Footer and their meta.js. */

/**
 * The two lines of the wordmark: set ones win; otherwise the site name's first
 * word, and the rest of it as the tagline. "Sublime Hair Studio" → "sublime" /
 * "hair studio"; "Bijou Boutique" → "bijou" / "boutique".
 */
export function wordmarkParts(siteName = '', { wordmark = '', tagline = '' } = {}) {
  const [first = '', ...rest] = String(siteName).trim().split(/\s+/)
  return {
    name: wordmark || first.toLowerCase(),
    tagline: tagline || rest.join(' ').toLowerCase(),
  }
}

/** The seal's initial: the wordmark's first letter, upper-case. */
export function initialOf(name = '') {
  return String(name).trim().charAt(0).toUpperCase()
}

/** The params Header and Footer declare for the wordmark. */
export const wordmarkParams = {
  wordmark: { type: 'string', label: 'Wordmark', description: 'The big italic word. Empty: the first word of the site name, in lower case.', default: '' },
  wordmarkTagline: { type: 'string', label: 'Wordmark tagline', description: 'The line of capitals under it. Empty: the rest of the site name.', default: '' },
  logo: { type: 'string', label: 'Logo image', description: 'A logo file to show instead of the type wordmark, e.g. /images/logo.png. Empty: the wordmark set in type.', default: '' },
}
