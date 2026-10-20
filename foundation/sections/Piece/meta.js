import { frameParam } from '#components/frame.js'

export default {
  title: 'Piece',
  description: 'A find’s own page: the photos in a matted frame with its swing tag, its label and era, the facts, the price, the two ways to have it (ask about it, come try it on), and its story. For the parametric page under Finds. The section’s own text is the message shown when a piece has come off the website.',

  // `finds`: this page's piece — the route query delivers it as a list of one.
  // `all`: every find (`fetch: { query: finds, as: all, current: include }`),
  // so the page knows whether the piece is "Just in".
  data: {
    finds: '@/piece',
    all: '@/piece',
  },

  content: {
    pretitle: 'When a piece is no longer online: a small label [0-1]',
    title: 'When a piece is no longer online: the heading',
    paragraphs: 'When a piece is no longer online: a line of explanation [0-2]',
    links: 'When a piece is no longer online: buttons, e.g. to the latest finds [0-2]',
  },

  params: {
    findsHref: { type: 'string', label: 'Finds page', default: '/finds' },
    visitHref: { type: 'string', label: '"Come try it on" link', default: '/visit' },
    fresh: { type: 'number', label: '"Just in" pieces', description: 'Keep in step with the Finds grid.', default: 3 },
    frame: frameParam('gate'),

    backLabel: { type: 'string', label: 'Back link words', default: 'All finds' },
    newLabel: { type: 'string', label: 'Tag on the newest finds', description: 'Empty for no tag.', default: 'Just in' },
    priceOnRequest: { type: 'string', label: 'Price when there is none', default: 'Price on request' },
    availability: { type: 'string', label: 'Line beside the price', description: 'Empty for none.', default: 'One of one · in the boutique' },
    enquireLabel: { type: 'string', label: 'Email button words', default: 'Ask about this piece' },
    visitLabel: { type: 'string', label: 'Visit button words', description: 'Empty to hide the button.', default: 'Come try it on' },
    writeLabel: { type: 'string', label: 'Email button when a piece is gone', description: 'Empty to hide it.', default: 'Write to us' },
    foundLabel: { type: 'string', label: 'Word before where it was found', default: 'Found' },
    storyLabel: { type: 'string', label: 'Heading beside the story', default: 'The story' },

    factLabel: { type: 'string', label: 'Facts: designer label', default: 'Label' },
    factEra: { type: 'string', label: 'Facts: era', default: 'Era' },
    factFabric: { type: 'string', label: 'Facts: fabric', default: 'Fabric' },
    factSize: { type: 'string', label: 'Facts: size', default: 'Size' },
    factCondition: { type: 'string', label: 'Facts: condition', default: 'Condition' },
    factAdded: { type: 'string', label: 'Facts: date it went online', default: 'Online since' },

    enquirySubject: { type: 'string', label: 'Email subject', description: '{piece} is the piece’s name; the designer is added after it.', default: 'About the {piece}' },
    enquiryMessage: { type: 'string', label: 'Email message', description: '{piece} is the piece’s name. It opens with "Hi" and the shop’s name.', default: "Is the {piece} still in the shop? I'd like to come in and try it on." },
  },
}
