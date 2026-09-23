export default {
  title: 'Note',
  description: 'A small aside in a hairline card: a label, a one-line heading, a sentence and a text link. For a footnote the page should mention without shouting — "we are hiring, occasionally".',
  family: 'callout',

  content: {
    pretitle: 'Label [0-1]',
    title: 'One short line',
    paragraphs: 'A sentence or two [0-1]',
    links: 'One text link [0-1]',
  },

  params: {
    align: {
      type: 'select', label: 'Alignment',
      options: [{ value: 'center', label: 'Centred' }, { value: 'left', label: 'Left' }],
      default: 'center',
    },
  },
}
