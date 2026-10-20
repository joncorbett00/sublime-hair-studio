/**
 * A headline as one run of text. Authors often stack a heading over several
 * `#` lines to sketch where it breaks; Kit would honour each line with a hard
 * <br>, so the heading breaks there at every width — "fits in your" alone on
 * a line in a column that had room for twice as much. Joined, it wraps to the
 * space it's given, and `text-balance` on the heading keeps the lines even.
 */
export function oneLine(text) {
  return Array.isArray(text) ? text.filter(Boolean).join(' ') : text
}
