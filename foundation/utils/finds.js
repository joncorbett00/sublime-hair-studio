/**
 * Finds: the pieces the website shows.
 *
 * The boutique holds far more than the site does. The site shows a changing
 * selection of key finds, and ONE place decides which: the `finds` query in
 * site/queries.yml — newest `added` first, up to its `limit`. Adding a piece
 * puts it at the front; the piece that falls past the limit comes off the
 * website (its card, its page, its URL) though it may well still be in the
 * shop. Its file stays in site/records/piece/.
 *
 * A piece's place is its position in that order, counted from 1 at the front.
 */

/** 'new' for the first `fresh` finds, else ''. */
export function markOf(place, { fresh = 3 } = {}) {
  return place && place <= fresh ? 'new' : ''
}

/** The place (1-based) of a piece among the finds, by its name. 0 when it is not among them. */
export function placeOf(piece, finds = []) {
  if (!piece) return 0
  const key = piece.$name
  return finds.findIndex((p) => p.$name === key) + 1
}

/**
 * "18 Sept" — the day a piece went on the site. Dates are read and written in
 * UTC so the prerendered page and the browser always agree on the day.
 */
export function arrivalDate(value, { year = false } = {}) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(year ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  })
}

/**
 * A photo at a given width. Unsplash stand-ins are resized by their CDN;
 * anything else is returned as written.
 */
export function photo(src, width = 900) {
  if (!src) return ''
  if (!/images\.unsplash\.com/.test(src)) return src
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', '80')
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  return url.toString()
}

export function photoSrcSet(src, widths = [480, 800, 1200]) {
  if (!src || !/images\.unsplash\.com/.test(src)) return undefined
  return widths.map((w) => `${photo(src, w)} ${w}w`).join(', ')
}

/**
 * A mailto link that names the piece, so the boutique knows what you mean.
 * `subject` and `message` are the section's words, with `{piece}` standing
 * for the piece's name; the greeting names the site.
 */
export function enquiryHref(email, piece, { site = '', subject: subjectWords = 'About the {piece}', message = '' } = {}) {
  if (!email) return ''
  const name = piece?.title || 'piece'
  const fill = (text) => String(text).replaceAll('{piece}', name)
  const subject = `${fill(subjectWords)}${piece?.designer ? ` by ${piece.designer}` : ''}`
  const body = `${site ? `Hi ${site},` : 'Hi,'}\n\n${fill(message)}\n\n`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
