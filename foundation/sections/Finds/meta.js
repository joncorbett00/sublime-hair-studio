import { toneParam } from '#components/tone.js'

export default {
  title: 'Finds',
  family: 'products',
  description: 'A grid of key finds, newest first, each on its wardrobe tag, the newest marked "Just in". Reads the `finds` query — set `query: finds` on the page, or `fetch: finds` on the section.',

  // `finds` is the list to show. `all` is optional: every find, sent beside a
  // shorter list so "Just in" still marks the right pieces.
  data: {
    finds: '@/piece',
    all: '@/piece',
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading [0-1]',
    paragraphs: 'A line beside the heading [0-2]',
    links: 'Buttons under that line [0-2]',
  },

  params: {
    start: {
      type: 'number',
      label: 'Start at',
      description: 'Begin this far down the list — 4 skips the three new arrivals shown above it.',
      default: 1,
    },
    count: {
      type: 'number',
      label: 'How many',
      description: 'Show at most this many. 0 shows the rest.',
      default: 0,
    },
    fresh: {
      type: 'number',
      label: '"Just in" pieces',
      description: 'How many of the newest finds are marked as just in.',
      default: 3,
    },
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { value: 2, label: '2 columns' },
        { value: 3, label: '3 columns' },
        { value: 4, label: '4 columns' },
      ],
      default: 3,
    },
    tone: toneParam,
  },

  presets: {
    default: { label: 'All the finds', params: { start: 1, columns: 3 } },
    rest: { label: 'After the new arrivals', params: { start: 4, columns: 3 } },
    more: { label: 'A few more', params: { count: 3 } },
  },
}
