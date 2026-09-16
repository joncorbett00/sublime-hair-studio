import { toneParam } from '#components/tone.js'

export default {
  title: 'Visit Us',
  description: 'Ruled rows of address, opening hours and contact beside a framed map and booking buttons, opening hours and contact details, plus optional practical notes (parking, accessibility, cancellation).',
  category: 'structure',
  purpose: 'Inform',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons in the contact card [0-2]',
    items: 'Practical notes — `###` heading, an icon, and a line of copy',
    data: 'A `yaml:hours` block — a list of { day, open }',
  },

  params: {
    address: { type: 'string', label: 'Postal address', default: '190 MacLaren Street\nOttawa, ON  K2P 0L6' },
    phone: { type: 'string', label: 'Phone (displayed)', default: '(613) 567-7400' },
    phoneHref: { type: 'string', label: 'Phone link', default: 'tel:+16135677400' },
    email: { type: 'string', label: 'Email', default: 'hello@sublimehair.ca' },
    mapEmbed: { type: 'string', label: 'Map iframe URL', default: '' },
    mapLink: { type: 'string', label: 'Directions link', default: '' },
    hoursNote: { type: 'string', label: 'Small italic line under the hours', default: "By appointment. Call ahead for same-day — we'll always try to fit you in." },
    tone: toneParam,
  },
}
