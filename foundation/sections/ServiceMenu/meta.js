import { toneParam } from '#components/tone.js'

export default {
  title: 'Service Menu',
  description: 'Services from the `services` collection. As a list: the full, numbered price menu with a category filter and each service’s photos (from `gallery`, matched on `service:`) in a lightbox. As cards: offering cards, one optionally set in the brand colour.',

  // Data blocks and queries reach the component only when declared.
  data: {
    'md:categories': { label: 'Category notes', content: { title: 'Category, as on the services', paragraphs: 'Note printed under its heading' } },
    services: {
      title: { type: 'string', default: '' },
      category: { type: 'string', default: '' },
      tagline: { type: 'string', default: '' },
      description: { type: 'string', default: '' },
      duration: { type: 'number', default: 0 },
      price: { type: 'number', default: 0 },
      priceNote: { type: 'string', default: '' },
      icon: { type: 'string', default: 'lu-scissors' },
      featured: { type: 'boolean', default: false },
      bookable: { type: 'boolean', default: true },
      square: { type: 'string', default: '' },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-3]',
  },

  params: {
    layout: {
      type: 'select', label: 'Layout',
      options: [{ value: 'list', label: 'Full price list' }, { value: 'cards', label: 'Offering cards' }],
      default: 'list',
    },
    highlight: { type: 'number', label: 'Cards: which card is set in the brand colour (1, 2, 3…; 0 for none)', default: 0 },
    highlightLabel: { type: 'string', label: 'Cards: badge on the brand-colour card', default: 'Signature' },
    note: { type: 'string', label: 'Small italic line under the services', default: '' },
    numbered: { type: 'boolean', label: 'Number the services', default: true },
    featuredLabel: { type: 'string', label: 'List: badge on featured services', description: 'Shown beside a service marked `featured`. Empty for none.', default: 'Signature' },
    bookLabel: { type: 'string', label: 'Booking button words', default: 'Book' },
    enquireLabel: { type: 'string', label: 'Button words for services not booked online', default: 'Enquire' },
    allLabel: { type: 'string', label: 'List: the "all" filter choice', default: 'All' },
    emptyText: { type: 'string', label: 'List: when there are no services to show', default: 'Nothing in that category yet.' },
    closeLabel: { type: 'string', label: 'Photo viewer: close button words', default: 'Close' },
    bookHref: { type: 'string', label: 'Booking page, for services with no `square:` ID', default: '/book' },
    enquireHref: { type: 'string', label: 'Where "Enquire" goes for services that are not booked online', default: '/visit' },
    showFilter: { type: 'boolean', label: 'List: show category filter', default: true },
    photosSource: {
      type: 'string',
      label: 'List: photo source',
      description: "The compiled `gallery` collection. A section gets only one declaratively-bound collection, so photos are fetched by path. Set to '' for a menu with no photos.",
      default: '/data/gallery.json',
    },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Full menu with filter', params: { layout: 'list', showFilter: true } },
    cards: { label: 'Three cards, middle in the brand colour', params: { layout: 'cards', highlight: 2 } },
  },
}
