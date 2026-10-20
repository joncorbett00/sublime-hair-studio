import { toneParam } from '#components/tone.js'

export default {
  title: 'Photo Wall',
  description: 'Numbered 4:5 photos from the `gallery` collection, as a lookbook grid with a category filter or as a single scrolling row with arrows, and a lightbox that pages with the arrow keys. Set `limit` to use it as a teaser on another page, and `showAll` to open the whole collection in a full-screen gallery.',

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
    aspect: {
      type: 'select', label: 'Photo shape',
      options: [
        { value: 'portrait', label: 'Portrait (4:5)' },
        { value: 'square', label: 'Square' },
        { value: 'landscape', label: 'Landscape (4:3)' },
      ],
      default: 'portrait',
    },
    limit: { type: 'number', label: 'Max photos (0 = all)', default: 0 },
    showFilter: { type: 'boolean', label: 'Grid: show category filter', default: true },
    showAll: {
      type: 'boolean', label: 'Show a "see all" button',
      description: 'When the section shows fewer photos than the collection has (a `limit`, or a filtered fetch), a button opens every photo in a full-screen gallery with a category filter.',
      default: false,
    },
    showAllLabel: { type: 'string', label: '"See all" button label', default: 'See all the work' },
    badgeLabel: { type: 'string', label: 'Word on each photo', description: 'Followed by its number — "Look 01". Empty for no badge.', default: 'Look' },
    allLabel: { type: 'string', label: 'Filter: the "all" choice', default: 'All' },
    wallLabel: { type: 'string', label: 'Full gallery: line above the title', description: '{count} is replaced by the number of photos.', default: 'All the work · {count} photos' },
    emptyText: { type: 'string', label: 'When a category has no photos', default: 'No photos in that category yet.' },
    closeLabel: { type: 'string', label: 'Photo viewer: close button words', default: 'Close' },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Full wall', params: { layout: 'grid', limit: 0, showFilter: true, columns: 3 } },
    carousel: { label: 'Teaser — one scrolling row', params: { layout: 'carousel', limit: 10, showAll: true } },
  },
}
