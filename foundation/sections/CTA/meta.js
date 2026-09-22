import { toneParam } from '#components/tone.js'

export default {
  title: 'Call to Action',
  description: 'The closing invitation as a full colour block: a poster-sized headline inside printer’s crop marks, a supporting line and one or two buttons.',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'The shout — put each line on its own `#` to stack it',
    paragraphs: 'Supporting line [0-2]',
    links: 'Buttons [0-2]',
  },

  params: {
    tone: { ...toneParam, default: 'brand' },
  },
}
