import { wordmarkParams } from '#utils/wordmark.js'

export default {
  title: 'Footer',
  description: 'On ink: blurb, social links, opening hours and link columns, signed off with the wordmark at the width of the page.',

  content: {
    title: 'Business name for the copyright line [0-1]',
    paragraphs: 'Short blurb [0-2]',
    links: 'Social profiles plus legal links — socials are detected by URL',
    lists: 'One markdown list of link columns — each top-level item is the column heading, with the links as a nested list beneath it. Add `{reload}` after a link to another site on the same domain.',
    data: 'A `yaml:hours` block — a list of { day, open }',
  },

  // Data blocks reach the component only when declared.
  data: {
    hours: {},
  },

  params: {
    edge: {
      type: 'select', label: 'Edge along the top',
      options: [
        { value: 'selvedge', label: 'Selvedge — a thin stripe of the brand colour' },
        { value: 'filmstrip', label: 'Film strip — a band punched with sprocket holes' },
      ],
      default: 'selvedge',
    },
    wordmark: wordmarkParams.wordmark,
    signoff: { type: 'string', label: 'Sign-off', description: 'Words after the copyright line, e.g. where the business is', default: '' },
    credit: { type: 'string', label: 'Credit line', description: 'Small print at the very end of the footer, e.g. who built the site', default: '' },
    creditHref: { type: 'string', label: 'Credit link', default: '' },
  },
}
