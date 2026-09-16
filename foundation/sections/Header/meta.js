export default {
  title: 'Studio Header',
  description: 'Fixed masthead: the three-colour stripe along the top, the wordmark at the centre, nav links split either side and the booking button on the right; a full-screen menu on small screens.',
  category: 'structure',
  purpose: 'Navigate',

  content: {
    links: 'Nav links. With Navigation set to "Authored links" these are the whole nav, split half and half around the wordmark (a link to the booking page becomes the button). Otherwise they follow the page nav [0-7]',
  },

  params: {
    nav: {
      type: 'select', label: 'Navigation',
      options: [
        { value: 'pages', label: 'Site pages, then authored links' },
        { value: 'authored', label: 'Authored links only' },
      ],
      default: 'pages',
    },
    bookHref: { type: 'string', label: 'Booking page', default: '/book' },
  },
}
