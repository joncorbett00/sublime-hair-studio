import { frameParam } from '#components/frame.js'

export default {
  title: 'Hero',
  description: 'Front-door hero set like a magazine cover — a poster-sized headline, intro copy, buttons and a row of headline numbers beside a matted photo — square, rounded, arched or oval — with a second photo laid over it and an optional turning seal.',

  content: {
    pretitle: 'Location or eyebrow label [0-1]',
    title: 'The big headline — put each line on its own `#`; mark the italic words `[like this]{accent}`',
    paragraphs: 'Intro copy [1-2]',
    links: 'Buttons — the first is the main one [0-3]',
    images: 'Two photos — the first fills the frame (its alt text is the running caption), the second sits in front of it',
  },

  // Data blocks reach the component only when declared.
  data: {
    // The `yaml:facts` block — a list of { value, label }.
    facts: {},
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
    flipped: { type: 'boolean', label: 'Photos on the left', default: false },
    frame: frameParam('arch'),
    inset: {
      type: 'select', label: 'Second photo',
      options: [
        { value: 'print', label: 'A print, laid square' },
        { value: 'polaroid', label: 'A Polaroid, pinned at an angle' },
      ],
      default: 'print',
    },
    captionLabel: { type: 'string', label: 'Caption label', description: 'The italic words before the running caption — "Look 01", "Take 01". Empty for none.', default: 'Look 01' },
    stamp: {
      type: 'string',
      label: 'Seal text',
      description: 'Short phrase that runs round the turning seal on the photo — it repeats and resizes to fill the ring, so anything from two words to a short sentence works. Leave empty for no seal.',
      default: '',
    },
    seal: {
      type: 'select', label: 'Seal',
      options: [
        { value: 'ring', label: 'Ring — a hairline round the initial' },
        { value: 'reel', label: 'Film reel — six holes round the initial' },
      ],
      default: 'ring',
    },
    sealLetter: { type: 'string', label: 'Seal initial', description: 'The letter at the middle of the seal. Empty: the wordmark’s first letter.', default: '' },
  },

  presets: {
    default: { label: 'Split with photos', params: { layout: 'split' } },
    plain: { label: 'Text only', params: { layout: 'stacked' } },
  },
}
