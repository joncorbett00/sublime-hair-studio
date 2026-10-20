/**
 * The words the finds sections share — the "Just in" tag, what a card says
 * with no price, and the line shown while there are no finds online. Declared
 * once, spread into each section's meta.js params, so Finds, New Arrivals and
 * Piece offer the same fields under the same names.
 */
export const findWordParams = {
  newLabel: { type: 'string', label: 'Tag on the newest finds', description: 'Empty for no tag.', default: 'Just in' },
  noPriceLabel: { type: 'string', label: 'Card price when there is none', default: 'Ask' },
}

export const emptyParam = {
  type: 'string',
  label: 'When there are no finds online',
  default: 'New finds are on their way — in the meantime, the shop is open.',
}
