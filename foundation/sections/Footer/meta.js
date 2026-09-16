export default {
  title: 'Studio Footer',
  description: 'On ink: blurb, social links, opening hours and link columns, signed off with the wordmark at the width of the page.',
  category: 'structure',
  purpose: 'Navigate',

  content: {
    title: 'Wordmark [0-1]',
    paragraphs: 'Short studio blurb [0-2]',
    links: 'Social profiles plus legal links — socials are detected by URL',
    lists: 'One markdown list of link columns — each top-level item is the column heading, with the links as a nested list beneath it',
    data: 'A `yaml:hours` block — a list of { day, open }',
  },

  params: {
    credit: { type: 'string', label: 'Credit line', description: 'Small print at the very end of the footer, e.g. who built the site', default: '' },
    creditHref: { type: 'string', label: 'Credit link', default: '' },
  },
}
