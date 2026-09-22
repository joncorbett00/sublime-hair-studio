import { wordmarkParams } from '#utils/wordmark.js'

export default {
  title: 'Masthead',
  description: 'Fixed masthead: an edge along the top (a selvedge stripe or a film strip), the wordmark at the centre, nav links split either side and a button on the right; a full-screen menu on small screens. Optionally a slim bar above it leading to another site.',

  content: {
    links: 'Nav links. With Navigation set to "Authored links" these are the whole nav, split half and half around the wordmark (a link to the button page becomes the button). Otherwise they follow the page nav [0-7]. Add `{reload}` after a link to another site on the same domain.',
    data: 'Optional `yaml:palettes` block — a list of { id, name, color, bright, deep, pop } for the floating palette picker; the first is the site’s own colour',
  },

  // Data blocks reach the component only when declared.
  data: {
    palettes: {},
  },

  params: {
    nav: {
      type: 'select', label: 'Navigation',
      options: [
        { value: 'pages', label: 'Site pages, then authored links' },
        { value: 'authored', label: 'Authored links only' },
      ],
      default: 'pages',
    },
    ctaHref: { type: 'string', label: 'Button page', description: 'The link drawn as the button on the right — the booking page, the visit page.', default: '/book' },
    ctaMobileLabel: { type: 'string', label: 'Button words in the phone menu', description: 'The full-width button at the foot of the phone menu. Empty: the button’s own label.', default: '' },
    edge: {
      type: 'select', label: 'Edge along the top',
      options: [
        { value: 'selvedge', label: 'Selvedge — a thin stripe of the brand colour' },
        { value: 'filmstrip', label: 'Film strip — a band punched with sprocket holes' },
      ],
      default: 'selvedge',
    },
    ...wordmarkParams,
    returnLabel: { type: 'string', label: 'Back-to link', description: 'Words for a slim bar above the masthead that leads to another site, e.g. "Back to Sublime Hair Studio". Empty: no bar.', default: '' },
    returnHref: { type: 'string', label: 'Back-to address', description: 'Where that bar goes. `/../` is the site one level up from this one on the same domain.', default: '' },
  },
}
