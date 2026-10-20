import { toneParam } from '#components/tone.js'

export default {
  title: 'Video Shelf',
  family: 'video',
  description: 'A shelf of short vertical videos (reels) in one row that scrolls sideways, with arrows beside the heading. Each clip plays silently on hover and opens in a player with sound that pages through the rest.',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Optional button beside the arrows, e.g. "Book an appointment" [0-2]',
    items: 'One `###` per clip — the title, a `####` tag ("Colour", "Cuts"), and the video as `![caption](address){role=video}`: a vertical .mp4 (add `poster=` for a still), or a YouTube or Vimeo link.',
  },

  params: {
    aspect: {
      type: 'select', label: 'Video shape',
      options: [
        { value: 'vertical', label: 'Vertical (9:16) — reels and shorts' },
        { value: 'square', label: 'Square' },
        { value: 'landscape', label: 'Landscape (16:9) — ordinary videos' },
      ],
      default: 'vertical',
    },
    badgeLabel: { type: 'string', label: 'Word on each video', description: 'Followed by its number — "Reel 01". Empty for no badge.', default: 'Reel' },
    closeLabel: { type: 'string', label: 'Player: close button words', default: 'Close' },
    tone: toneParam,
  },
}
