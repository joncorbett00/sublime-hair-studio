import { toneParam } from '#components/tone.js'

export default {
  title: 'Timeline',
  description: 'A career or a history in chapters: the year in poster-sized serif, a headline, a line of story and a matted photo, hung from a hairline down the page with photos alternating sides.',
  category: 'content',
  purpose: 'Introduce',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons [0-2]',
    items: 'One `###` per chapter — the heading is the year, `####` the headline, then a paragraph and one photo (its alt text is the caption)',
  },

  params: {
    tone: toneParam,
  },
}
