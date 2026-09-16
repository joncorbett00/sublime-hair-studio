import { toneParam } from '#components/tone.js'

export default {
  title: 'FAQ',
  description: 'An accordion of questions and answers. Write each question as a `###` heading with the answer underneath, or wrap the whole set in an ```md:faq``` block.',
  category: 'content',
  purpose: 'Explain',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-1]',
    items: 'Questions — `###` question, then the answer as paragraphs',
  },

  params: {
    tone: toneParam,
  },
}
