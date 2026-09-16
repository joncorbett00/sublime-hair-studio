export default {
  title: 'Hero',
  description: 'Front-door hero set like a magazine cover — a poster-sized headline, intro copy, buttons and a row of headline numbers beside a matted arched photo with a second photo laid over it and an optional turning seal.',
  category: 'impact',
  purpose: 'Introduce',

  content: {
    pretitle: 'Location or eyebrow label [0-1]',
    title: 'The big headline — put each line on its own `#`; mark the italic words `[like this]{accent}`',
    paragraphs: 'Intro copy [1-2]',
    links: 'Buttons — the first is the booking one [0-3]',
    images: 'Two photos — the first fills the arch (its alt text is the running caption), the second sits in front of it',
    data: 'A `yaml:facts` block — a list of { value, label }',
  },

  params: {
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'split', label: 'Text beside photos' },
        { value: 'stacked', label: 'Text only, full width' },
      ],
      default: 'split',
    },
    stamp: {
      type: 'string',
      label: 'Seal text',
      description: 'Short phrase that runs round the turning seal on the photo. Leave empty for no seal.',
      default: '',
    },
  },

  presets: {
    default: { label: 'Split with photos', params: { layout: 'split' } },
    plain: { label: 'Text only', params: { layout: 'stacked' } },
  },
}
