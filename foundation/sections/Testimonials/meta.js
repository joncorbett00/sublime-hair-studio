import { toneParam } from '#components/tone.js'

export default {
  title: 'Reviews',
  description: 'Compact review cards in a row, with the heading and an all-reviews link above. A long review shows to a fixed height under a fade, opens a few lines more on hover, and opens in full when the card is pressed. Fed by the `reviews` collection (a random few, filtered by rating and age where a review has them, reshuffled per visit); the authored `###` items are the fallback when that is empty.',

  data: {
    reviews: {
      author: { type: 'string', default: '' },
      rating: { type: 'number', default: 0 },
      date: { type: 'string', default: '' },
      text: { type: 'string', default: '' },
      source: { type: 'string', default: '' },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    links: 'Optional button beside the heading — e.g. "Read all our reviews on Google" [0-1]',
    items: 'Fallback reviews — `###` reviewer name, `####` context, then the quote. Add a ```yaml:review``` block with `rating: 4` to show fewer than five stars.',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 3,
    },
    pick: { type: 'number', label: 'Reviews to show', default: 3 },
    minRating: { type: 'number', label: 'Minimum stars', default: 4 },
    maxAgeMonths: { type: 'number', label: 'Only reviews from the last N months', default: 12 },
    excerpt: { type: 'number', label: 'Reviews longer than this many characters are faded and open in full on click (0 = always show the whole review)', default: 160 },
    showStars: { type: 'boolean', label: 'Show star ratings', default: true },
    showSource: { type: 'boolean', label: 'Show where and when each review was left', default: true },
    tone: toneParam,
  },
}
