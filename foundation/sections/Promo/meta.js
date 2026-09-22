import { toneParam } from '#components/tone.js'

export default {
  title: 'Promo',
  description: 'A seasonal offer set as a coupon band: a dashed tear-off edge with scissors, a poster-sized offer figure ("10% off"), a headline and terms, and the booking button.',

  content: {
    pretitle: 'The name of the offer, e.g. "Back to school" [0-1]',
    title: 'Headline — mark the italic words `[like this]{accent}` [0-1]',
    paragraphs: 'The terms, in a line or two [0-2]',
    links: 'Buttons — the first is the booking one [0-2]',
  },

  params: {
    figure: { type: 'string', label: 'Offer figure', description: 'The big number, e.g. "10%" or "$20". Leave empty for none.', default: '' },
    figureLabel: { type: 'string', label: 'Word after the figure', description: 'Set in italic beside it, e.g. "off"', default: '' },
    note: { type: 'string', label: 'Fine print under the button', description: 'e.g. "Until September 30"', default: '' },
    tone: { ...toneParam, default: 'brand' },
  },
}
