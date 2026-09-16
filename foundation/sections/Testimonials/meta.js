import { toneParam } from '#components/tone.js'

export default {
  title: 'Reviews',
  description: 'Staggered pull-quote cards, the middle one in vermilion. Fed by the `reviews` collection (a random few, filtered by rating and age, reshuffled per visit); the authored `###` items are the fallback when that is empty.',
  category: 'showcase',
  purpose: 'Reassure',

  data: {
    reviews: {
      author: { type: 'string', default: '' },
      rating: { type: 'number', default: 5 },
      date: { type: 'string', default: '' },
      text: { type: 'string', default: '' },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    links: 'Optional button under the cards — e.g. "Read all our reviews on Google" [0-1]',
    items: 'Fallback reviews — `###` reviewer name, `####` context, then the quote. Add a ```yaml:review``` block with `rating: 4` to show fewer than five stars.',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }],
      default: 3,
    },
    pick: { type: 'number', label: 'Reviews to show', default: 3 },
    minRating: { type: 'number', label: 'Minimum stars', default: 4 },
    maxAgeMonths: { type: 'number', label: 'Only reviews from the last N months', default: 12 },
      tone: toneParam,
  },
}
