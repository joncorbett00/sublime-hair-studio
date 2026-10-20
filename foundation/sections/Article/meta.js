import { toneParam } from '#components/tone.js'

export default {
  title: 'Article',
  description: 'Long-form text in one readable column: a label and title, then ordinary markdown — `##` sub-headings, paragraphs, lists and links — set as running text. For privacy, accessibility and other pages that are mostly words.',
  family: 'article',

  content: {
    pretitle: 'Label [0-1]',
    title: 'Page title',
    paragraphs: 'Body text — with `##` sub-headings, lists and links, in any order',
  },

  params: {
    layout: {
      type: 'select', label: 'Layout',
      options: [
        { value: 'stacked', label: 'Title above the text' },
        { value: 'side', label: 'Title on the left, text on the right' },
      ],
      default: 'stacked',
    },
    tone: toneParam,
    updated: { type: 'string', label: 'Last updated', description: 'Shown under the title, e.g. "September 2026". Leave empty to hide.', default: '' },
    updatedLabel: { type: 'string', label: 'Words before the date', default: 'Last updated' },
  },
}
