import { toneParam } from '#components/tone.js'

export default {
  title: 'Visit Us',
  description: 'Ruled rows of address, opening hours and contact beside a framed street map (the seal initial as its pin) and buttons, plus optional practical notes (parking, accessibility, cancellation, holds).',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons in the contact card [0-2]',
    items: 'Practical notes — `###` heading, an icon, and a line of copy',
  },

  // Data blocks reach the component only when declared.
  data: {
    // The `yaml:hours` block — a list of { day, open }.
    hours: {},
  },

  params: {
    address: { type: 'string', label: 'Postal address', default: '' },
    phone: { type: 'string', label: 'Phone (displayed)', default: '' },
    phoneHref: { type: 'string', label: 'Phone link', default: '' },
    email: { type: 'string', label: 'Email', default: '' },
    lat: { type: 'number', label: 'Map latitude', description: 'Where the pin goes, in decimal degrees. With longitude, draws the quiet street map with the seal as its pin.' },
    lng: { type: 'number', label: 'Map longitude', description: 'Where the pin goes, in decimal degrees.' },
    zoom: { type: 'number', label: 'Map zoom', description: '16 shows the block and the streets either side; 15 the neighbourhood; 17 the doors.', default: 16 },
    mapTone: {
      type: 'select', label: 'Map colour',
      options: [
        { value: 'sand', label: 'Sand — a shade under the page, streets in paper' },
        { value: 'ink', label: 'Ink — dark, streets in warm greys' },
      ],
      default: 'sand',
    },
    pinLetter: { type: 'string', label: 'Letter on the pin', description: 'Empty: the first letter of the wordmark, as on the seal.', default: '' },
    mapEmbed: { type: 'string', label: 'Map iframe URL', description: 'Only used when no latitude and longitude are set.', default: '' },
    mapLink: { type: 'string', label: 'Directions link', description: 'Where the map and the directions link go. Empty: Google Maps at the pin.', default: '' },
    mapTitle: { type: 'string', label: 'Map name', description: 'What a screen reader announces for the map', default: 'Map to the studio' },
    hoursNote: { type: 'string', label: 'Small italic line under the hours', default: '' },
    flipped: { type: 'boolean', label: 'Map on the left', default: false },
    whereLabel: { type: 'string', label: 'Label for the address', default: 'Where' },
    whenLabel: { type: 'string', label: 'Label for the hours', default: 'When' },
    contactLabel: { type: 'string', label: 'Label for phone and email', default: 'Reach us' },
    directionsLabel: { type: 'string', label: 'Directions link words', default: 'Get directions' },
    todayLabel: { type: 'string', label: 'Marker beside today in the hours', description: 'Empty for none.', default: 'Today' },
    tone: toneParam,
  },
}
