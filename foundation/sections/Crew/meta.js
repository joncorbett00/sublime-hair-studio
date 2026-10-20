import { toneParam } from '#components/tone.js'
import { frameParam } from '#components/frame.js'

export default {
  title: 'The Crew',
  description: 'Matted stylist portraits (arched, oval, rounded or square), from the `crew` collection. Each card opens a dialog with the full bio and a link to the booking page.',

  data: {
    crew: {
      title: { type: 'string', default: '' },
      role: { type: 'string', default: '' },
      pronouns: { type: 'string', default: '' },
      image: { type: 'string', default: '' },
      tagline: { type: 'string', default: '' },
      bio: { type: 'string', default: '' },
      specialties: { type: 'array', default: [] },
      favouriteThing: { type: 'string', default: '' },
      worstHaircut: { type: 'string', default: '' },
      instagram: { type: 'string', default: '' },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
  },

  params: {
    bookHref: { type: 'string', label: 'Booking page', default: '/book' },
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 3,
    },
    frame: frameParam('arch'),
    monochrome: { type: 'boolean', label: 'Black and white, colour on hover', default: true },
    numbered: { type: 'boolean', label: 'Number the cards', default: true },
    meetLabel: { type: 'string', label: 'Link on each card', description: 'Followed by the first name — "Meet Sonia".', default: 'Meet' },
    bookLabel: { type: 'string', label: 'Booking button in the dialog', description: 'Followed by the first name — "Book with Sonia".', default: 'Book with' },
    favouriteLabel: { type: 'string', label: 'Label for the favourite part of the job', default: 'Favourite part of the job' },
    worstLabel: { type: 'string', label: 'Label for the worst haircut', default: 'Worst haircut they have ever had' },
    workLabel: { type: 'string', label: 'Instagram link words', default: 'Their work' },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Three across', params: { columns: 3 } },
  },
}
