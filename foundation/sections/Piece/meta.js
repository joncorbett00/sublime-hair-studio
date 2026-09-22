export default {
  title: 'Piece',
  description: 'A find’s own page: the photos in a film-gate mat with its wardrobe tag, where it was worn on a clapperboard slate, the facts, the price, "Ask about this piece" and "Come try it on", and its story. For the parametric page under Finds.',

  // `finds`: this page's piece — the route query delivers it as a list of one.
  // `all`: every find (`fetch: { query: finds, as: all, current: include }`),
  // so the page knows whether the piece is "Just in".
  data: {
    finds: '@/piece',
    all: '@/piece',
  },

  content: {},

  params: {
    findsHref: { type: 'string', label: 'Finds page', default: '/finds' },
    visitHref: { type: 'string', label: '"Come try it on" link', default: '/visit' },
    fresh: { type: 'number', label: '"Just in" pieces', description: 'Keep in step with the Finds grid.', default: 3 },
  },
}
