import { toneParam } from '#components/tone.js'

export default {
  family: 'teaser',
  title: 'New Arrivals',
  description: 'The newest finds as a magazine spread — the latest piece large, the next ones stepped down beside it — with the date of the latest by the heading. Reads the `finds` query.',

  data: {
    finds: '@/piece',
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading [0-1]',
    paragraphs: 'A line beside the heading [0-1]',
    links: 'A text link under it, such as to all the finds [0-1]',
  },

  params: {
    count: {
      type: 'number',
      label: 'How many',
      description: 'How many of the newest finds to feature. Three fills the spread.',
      default: 3,
    },
    tone: toneParam,
  },
}
