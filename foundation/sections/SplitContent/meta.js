import { toneParam } from '#components/tone.js'

export default {
  title: 'Split Content',
  description: 'Prose, buttons and a numbered list on one side; on the other a photo set on a solid block of colour with a hairline frame. The general-purpose section for story, policy and explainer content.',
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
    shadow: {
      type: 'select', label: 'Colour block behind the photo',
      options: [
        { value: 'primary', label: 'Vermilion' },
        { value: 'accent', label: 'Marigold' },
        { value: 'secondary', label: 'Bottle green' },
        { value: 'heading', label: 'Ink' },
      ],
      default: 'primary',
    },
    frame: {
      type: 'select', label: 'Photo frame',
      options: [{ value: 'rounded', label: 'Square' }, { value: 'arch', label: 'Arched window' }],
      default: 'rounded',
    },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Photo right', params: { flipped: false } },
    flipped: { label: 'Photo left', params: { flipped: true, shadow: 'accent' } },
  },
}
