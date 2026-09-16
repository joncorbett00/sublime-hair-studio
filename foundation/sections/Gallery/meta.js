import { toneParam } from '#components/tone.js'

export default {
  title: 'Photo Wall',
  description: 'Lookbook grid of numbered 4:5 photos from the `gallery` collection, with a category filter and a lightbox that pages with the arrow keys. Set `limit` to use it as a teaser on another page.',
  category: 'showcase',
  purpose: 'Show',

  data: {
    gallery: {
      title: { type: 'string', default: '' },
      caption: { type: 'string', default: '' },
      category: { type: 'string', default: '' },
      image: { type: 'string', default: '' },
      stylist: { type: 'string', default: '' },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Optional button under the grid — e.g. "See all the work" [0-2]',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 3,
    },
    limit: { type: 'number', label: 'Max photos (0 = all)', default: 0 },
    showFilter: { type: 'boolean', label: 'Show category filter', default: true },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Full wall', params: { limit: 0, showFilter: true, columns: 3 } },
    teaser: { label: 'Teaser — 6 photos, no filter', params: { limit: 6, showFilter: false, columns: 3 } },
  },
}
