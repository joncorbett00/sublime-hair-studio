import { wordmarkParams } from '#utils/wordmark.js'
import { toneParam } from '#components/tone.js'

export default {
  title: 'Footer',
  description: 'On ink: blurb, social links, opening hours and link columns, signed off with the wordmark at the width of the page.',

  content: {
    title: 'Business name for the copyright line [0-1]',
    paragraphs: 'Short blurb [0-2]',
    links: 'Social profiles plus legal links — socials are detected by URL',
    lists: 'Link columns, when there is no "Link columns" block: one markdown list, each top-level item the column heading with the links as a nested list beneath it. Add `{reload}` after a link to another site on the same domain.',
  },

  // Data blocks reach the component only when declared.
  data: {
    'md:hours': { label: 'Opening hours', content: { title: 'Day', paragraphs: 'Hours' } },
    // The way to write the columns on a site in more than one language: the
    // translation tools don't reach the links in a nested list.
    'md:columns': { label: 'Link columns', hint: 'A `#` heading for each column, then a list of its links.', content: { title: 'Column heading', lists: 'Its links' } },
  },

  params: {
    tone: { ...toneParam, label: 'Colour', default: 'ink' },
    signature: { type: 'boolean', label: 'Sign off with the big wordmark or logo', default: true },
    hoursLabel: { type: 'string', label: 'Hours heading', default: 'Hours' },
    edge: {
      type: 'select', label: 'Edge along the top',
      options: [
        { value: 'selvedge', label: 'Selvedge — a thin stripe of the brand colour' },
        { value: 'filmstrip', label: 'Film strip — a band punched with sprocket holes' },
      ],
      default: 'selvedge',
    },
    wordmark: wordmarkParams.wordmark,
    logo: wordmarkParams.logo,
    signoff: { type: 'string', label: 'Sign-off', description: 'Words after the copyright line, e.g. where the business is', default: '' },
    credit: { type: 'string', label: 'Credit line', description: 'Small print at the very end of the footer, linking to Uniweb Studio, who built the site. Empty: no credit.', default: 'Created by Uniweb Studio' },
    badge: { type: 'string', label: 'Corner badge', description: 'Words on the ribbon of a small medallion pinned to the bottom corner of every page, e.g. "20 Years". Empty: no badge.', default: '' },
    badgeTop: { type: 'string', label: 'Badge — words over the top', default: '' },
    badgeBottom: { type: 'string', label: 'Badge — words round the foot', default: '' },
    badgeSize: {
      type: 'select', label: 'Badge — size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      default: 'medium',
    },
    badgeCloseLabel: { type: 'string', label: 'Badge — hide button, for screen readers', default: 'Hide' },
  },
}
