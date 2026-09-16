import { toneParam } from '#components/tone.js'

export default {
  title: 'The Crew',
  description: 'Matted arched stylist portraits, from the `crew` collection. Each card opens a dialog with the full bio and a link to the booking page.',
  category: 'showcase',
  purpose: 'Introduce',

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
      tone: toneParam,
  },

  presets: {
    default: { label: 'Three across', params: { columns: 3 } },
  },
}
