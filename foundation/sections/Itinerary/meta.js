import { toneParam } from '#components/tone.js'

export default {
  title: 'Itinerary',
  description: 'A timed run-of-show drawn as a backstage running-order card beside a heading — "12:00 leave the office, 12:50 back at your desk".',
  category: 'content',
  purpose: 'Explain',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading',
    paragraphs: 'Body copy [0-3]',
    links: 'Buttons [0-2]',
    items: 'One `###` per stop — the heading is the time, `####` the step, a paragraph of detail. The last stop is marked as the finish.',
  },

  params: {
    cardTitle: { type: 'string', label: 'Card title', description: 'A small italic line at the top of the card', default: '' },
    tone: toneParam,
  },
}
