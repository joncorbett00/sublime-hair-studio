import { toneParam } from '#components/tone.js'

export default {
  title: 'Product Grid',
  description: 'A row of shelf products from the `products` collection, each card linking out to its page in the shop. Cards are text-forward and show a photo only when the product has one, so a line can be featured before its photography exists.',

  data: {
    products: {
      title: { type: 'string', default: '' },
      brand: { type: 'string', default: '' },
      category: { type: 'string', default: '' },
      tagline: { type: 'string', default: '' },
      size: { type: 'string', default: '' },
      price: { type: 'number', default: 0 },
      image: { type: 'string', default: '' },
      href: { type: 'string', default: '' },
      featured: { type: 'boolean', default: false },
    },
  },

  content: {
    pretitle: 'Eyebrow label [0-1]',
    title: 'Section heading [0-1]',
    paragraphs: 'Intro copy [0-2]',
    links: 'Buttons under the grid [0-2] — usually the shop',
  },

  params: {
    columns: {
      type: 'select', label: 'Columns',
      options: [{ value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }],
      default: 4,
    },
    showPrices: { type: 'boolean', label: 'Show prices', default: true },
    ctaLabel: { type: 'string', label: 'Link on each card', default: 'Shop' },
    note: { type: 'string', label: 'Small italic line under the grid', default: '' },
    tone: toneParam,
  },

  presets: {
    default: { label: 'Four across', params: { columns: 4 } },
    trio: { label: 'Three across', params: { columns: 3 } },
  },
}
