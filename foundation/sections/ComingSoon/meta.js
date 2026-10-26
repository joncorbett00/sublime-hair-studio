export default {
  title: 'Coming Soon',
  description: 'A quiet holding page while the site gets ready: a short headline, a line or two, and one email box for "tell me when you open". Where the site has nowhere to send sign-ups, the box is left out and the links show instead.',
  family: 'newsletter',

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'The headline — mark the italic words `[like this]{accent}`',
    paragraphs: 'A line or two [0-2]',
    links: 'Links shown under the box — and in its place when sign-ups have nowhere to go [0-2]',
  },

  params: {
    placeholder: { type: 'string', label: 'Email box hint', default: 'you@example.com' },
    buttonLabel: { type: 'string', label: 'Button words', default: 'Notify me' },
    thanks: { type: 'string', label: 'Thank-you message', description: 'Shown in place of the box once someone signs up.', default: 'Thank you — we’ll write when the doors open.' },
    failed: { type: 'string', label: 'Error message', description: 'Shown when a sign-up could not be sent.', default: 'That didn’t go through. Please try again in a moment.' },
  },
}
