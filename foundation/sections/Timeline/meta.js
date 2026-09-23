import { toneParam } from '#components/tone.js'

export default {
  title: 'Timeline',
  description: 'A career or a history in chapters: the year at poster size, a headline, a line of story and a matted photo, hung from a hairline down the page with photos alternating sides. An optional portrait opens the story beside the heading.',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Heading',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons [0-2]',
    images: 'Optional portrait, before the first chapter — shown in an arched mat beside the heading; its alt text is the caption',
    items: 'One `###` per chapter — the heading is the year, `####` the headline, then a paragraph and one photo (its alt text is the caption)',
  },

  params: {
    tone: toneParam,
  },
}
