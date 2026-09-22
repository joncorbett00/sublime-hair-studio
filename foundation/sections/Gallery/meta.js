import { toneParam } from '#components/tone.js'

export default {
  title: 'Photo Wall',
  description: 'Numbered 4:5 photos from the `gallery` collection, as a lookbook grid with a category filter or as a single scrolling row with arrows, and a lightbox that pages with the arrow keys. Set `limit` to use it as a teaser on another page.',

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
    links: 'Optional button — under the grid, or beside the arrows in a carousel — e.g. "See all the work" [0-2]',
  },

  params: {
    layout: {
      type: 'select', label: 'Layout',
      options: [{ value: 'grid', label: 'Grid' }, { value: 'carousel', label: 'One scrolling row' }],
      default: 'grid',
    },
    columns: {
      type: 'select', label: 'Grid: columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 3,
    },
    limit: { type: 'number', label: 'Max photos (0 = all)', default: 0 },
    showFilter: { type: 'boolean', label: 'Grid: show category filter', default: true },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Full wall', params: { layout: 'grid', limit: 0, showFilter: true, columns: 3 } },
    carousel: { label: 'Teaser — one scrolling row', params: { layout: 'carousel', limit: 10 } },
  },
}
