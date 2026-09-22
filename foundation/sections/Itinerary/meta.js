import { toneParam } from '#components/tone.js'

export default {
  title: 'Itinerary',
  family: 'steps',
  description: 'A timed run-of-show or a run of steps, drawn as a card pinned up backstage beside a heading — a salon running order ("12:00 leave the office, 12:50 back at your desk") or a film call sheet. The last stop is marked as the finish.',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading',
    paragraphs: 'Body copy [0-3]',
    links: 'Buttons [0-2]',
    items: 'One `###` per stop — the heading is the short label on the left (a time, a day, a number), `####` the step, a paragraph of detail. The last stop is marked as the finish.',
  },

  params: {
    cardLabel: { type: 'string', label: 'Card label', description: 'Wide capitals at the top left of the card — "Running order", "Call sheet"', default: 'Running order' },
    cardTitle: { type: 'string', label: 'Card title', description: 'A small italic line at the top of the card', default: '' },
    tone: toneParam,
  },
}
