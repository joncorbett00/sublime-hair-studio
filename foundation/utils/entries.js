import { oneLine } from './text.js'

/**
 * The entries of a concept block (```md:hours, ```md:facts, …) as
 * { title, text }: each `#` heading and the line written under it. Both are
 * HTML strings — render them with Kit's Text.
 */
export const entries = (block) =>
  (block?.items || []).map((item) => ({ title: oneLine(item.title), text: item.paragraphs[0] || '' }))
