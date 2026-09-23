import { toneParam } from '#components/tone.js'

export default {
  title: 'Brands',
  description: 'The lines a business carries, on framed shelf cards: brand, where it is from and one line each. Each card opens a dialog with the full story and a link to the brand’s own site.',
  family: 'card-grid',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    items: 'One `###` per brand — the heading is its name, `####` where it is from; the first paragraph is the line on the card, the rest is the story in the dialog. A link is the brand’s site; a photo is optional',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 4,
    },
    moreLabel: { type: 'string', label: 'Link on each card', default: 'Read more' },
    note: { type: 'string', label: 'Small italic line under the grid', default: '' },
    tone: toneParam,
  },
}
