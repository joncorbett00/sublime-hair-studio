import { toneParam } from '#components/tone.js'

export default {
  title: 'FAQ',
  description: 'An accordion of questions and answers. Write each question as a `###` heading with the answer underneath, or wrap the whole set in an ```md:faq``` block.',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-1]',
    items: 'Questions — `###` question, then the answer as paragraphs',
  },

  // An optional ```md:faq block, in place of the items.
  data: {
    'md:faq': { label: 'Questions and answers [1+]', content: { title: 'Question', paragraphs: 'Answer' } },
  },

  params: {
    layout: {
      type: 'select', label: 'Layout',
      options: [
        { value: 'side', label: 'Heading on the left, questions on the right' },
        { value: 'stacked', label: 'Heading above the questions' },
      ],
      default: 'side',
    },
    openFirst: { type: 'boolean', label: 'Open the first answer', default: true },
    numbered: { type: 'boolean', label: 'Number the questions', default: true },
    tone: toneParam,
  },
}
