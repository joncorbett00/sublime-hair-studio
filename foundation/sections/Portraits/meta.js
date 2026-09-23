import { toneParam } from '#components/tone.js'

export default {
  title: 'Portraits',
  description: 'A few people (or dogs) with their whole story showing: an arched matted photo, the name large, a short line under it and a few paragraphs. For the studio dogs, a founder, a partner — anyone who deserves more than a card.',
  family: 'team',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading',
    paragraphs: 'Intro copy [0-2]',
    items: 'One `###` per portrait — the heading is the name, `####` a short line under it (breed, years, role), then one photo and the story',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2 — staggered' }, { value: 3, label: '3' }],
      default: 2,
    },
    tone: toneParam,
  },
}
