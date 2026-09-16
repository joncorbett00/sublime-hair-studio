export default {
  title: 'Ticker',
  description: 'An edge-to-edge scrolling ticker of short phrases, alternating italic serif and wide capitals. Pauses on hover, and holds still for anyone who has asked for reduced motion.',
  category: 'impact',
  purpose: 'Delight',
  background: 'self',

  content: {
    lists: 'One markdown list — each item is a phrase in the ticker',
  },

  params: {
    speed: { type: 'number', label: 'Seconds per loop', default: 40 },
    direction: {
      type: 'select', label: 'Direction',
      options: [{ value: 'left', label: 'Right to left' }, { value: 'right', label: 'Left to right' }],
      default: 'left',
    },
    tone: {
      type: 'select', label: 'Colour',
      options: ['vermilion', 'marigold', 'green', 'ink'],
      default: 'vermilion',
    },
  },

  presets: {
    default: { label: 'Vermilion, leftward', params: { tone: 'vermilion', direction: 'left' } },
    marigold: { label: 'Marigold, rightward', params: { tone: 'marigold', direction: 'right', speed: 44 } },
  },
}
