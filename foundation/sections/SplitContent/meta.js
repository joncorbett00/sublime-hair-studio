import { toneParam } from '#components/tone.js'

export default {
  title: 'Split Content',
  description: 'Prose, buttons and a numbered list on one side; on the other a matted photo with a hairline around the mount. The general-purpose section for story, policy and explainer content.',
  category: 'content',
  purpose: 'Explain',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading',
    paragraphs: 'Body copy [0-4]',
    items: 'Optional list — `###` heading plus a line, with an optional icon',
    links: 'Buttons [0-2]',
    images: 'One photo — its alt text is the caption',
  },

  params: {
    flipped: { type: 'boolean', label: 'Photo on the left', default: false },
    frame: {
      type: 'select', label: 'Photo frame',
      options: [{ value: 'rounded', label: 'Square' }, { value: 'arch', label: 'Arched window' }],
      default: 'rounded',
    },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Photo right', params: { flipped: false } },
    flipped: { label: 'Photo left', params: { flipped: true } },
  },
}
