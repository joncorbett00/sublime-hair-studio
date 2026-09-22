import { toneParam } from '#components/tone.js'

export default {
  title: 'Visit Us',
  description: 'Ruled rows of address, opening hours and contact beside a framed map and buttons, plus optional practical notes (parking, accessibility, cancellation, holds).',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons in the contact card [0-2]',
    items: 'Practical notes — `###` heading, an icon, and a line of copy',
    data: 'A `yaml:hours` block — a list of { day, open }',
  },

  // Data blocks reach the component only when declared.
  data: {
    hours: {},
  },

  params: {
    address: { type: 'string', label: 'Postal address', default: '' },
    phone: { type: 'string', label: 'Phone (displayed)', default: '' },
    phoneHref: { type: 'string', label: 'Phone link', default: '' },
    email: { type: 'string', label: 'Email', default: '' },
    mapEmbed: { type: 'string', label: 'Map iframe URL', default: '' },
    mapLink: { type: 'string', label: 'Directions link', default: '' },
    mapTitle: { type: 'string', label: 'Map name', description: 'What a screen reader announces for the map', default: 'Map to the studio' },
    hoursNote: { type: 'string', label: 'Small italic line under the hours', default: '' },
    tone: toneParam,
  },
}
