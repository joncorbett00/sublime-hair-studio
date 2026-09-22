import { P, Icon, Link, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { money } from '#components/money.js'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

const pad = (n) => String(n).padStart(2, '0')

const COLS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * One product, the way the shelf card reads: brand in wide capitals, the product
 * name large, a line about who it is for, then the price and the way out to the
 * shop. The photo is optional — a card with no `image:` is text-only rather than
 * a broken frame, which is what lets the studio feature a line before it has
 * photographed it.
 *
 * The whole card is one link. The visible "Shop" line is decoration, so it is
 * hidden from screen readers to keep a single stop per product.
 */
function ProductCard({ product, index, showPrice, ctaLabel }) {
  const { title, brand, category, tagline, size, price, image, href } = product
  const priced = showPrice && Number(price) > 0

  return (
    <Link
      href={href}
      className="framed lift group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading"
    >
      {image && (
        <img
          src={image}
          alt=""
          className="aspect-square w-full bg-muted object-contain p-7"
          loading="lazy"
        />
      )}

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {/* `shrink-0` on the number: "René Furterer" wraps in a narrow card, and
            without it the number wraps along with the brand. */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="caps text-[0.5625rem] text-accent-ink">{brand}</span>
          <span className="font-display shrink-0 text-sm italic text-subtle" aria-hidden="true">No.&thinsp;{pad(index + 1)}</span>
        </div>

        <h3 className="font-display mt-4 text-2xl font-medium leading-tight tracking-tight text-heading">
          {title}
        </h3>

        {category && <p className="caps mt-2.5 text-[0.5625rem] text-subtle">{category}</p>}
        {tagline && <p className="mt-4 leading-relaxed text-body">{tagline}</p>}

        <div className="mt-auto pt-7">
          {(priced || size) && (
            <p className="flex items-baseline gap-2.5">
              {priced && (
                <span className="font-display text-2xl font-medium leading-none tracking-tight text-heading">
                  {money(price)}
                </span>
              )}
              {size && <span className="caps text-[0.5625rem] text-subtle">{size}</span>}
            </p>
          )}
          <span className="text-cta mt-4" aria-hidden="true">
            {ctaLabel} <Icon name="lu-arrow-right" size="13" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/**
 * The shelf, on the page: a few featured products linking out to the shop. Sits
 * on the homepage as the reason to climb the stairs without an appointment.
 */
export default function ProductGrid({ content, params, block }) {
  /* Array.isArray, not `|| []`: a collection that has not been generated yet
     (a new collection, before the next build writes public/data) arrives as a
     non-array, and mapping it takes the whole page down. */
  const products = Array.isArray(content.data?.products) ? content.data.products : []
  const { pretitle, title, paragraphs } = content
  const links = buttonLinks(content)
  const { columns = 4, showPrices = true, ctaLabel = 'Shop', note = '', tone = '' } = params

  if (block.dataLoading) return <DataPlaceholder lines={6} />

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="gap-8 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <Shout pretitle={pretitle} title={title} block={block} size="md" />
          {paragraphs.length > 0 && (
            <div className="mt-8 lg:mt-0">
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('text-lg leading-relaxed text-body', i > 0 && 'mt-4')} />
              ))}
            </div>
          )}
        </div>

        <ul className={cn('mt-16 grid grid-cols-1 gap-8', COLS[columns] || COLS[4])}>
          {products.map((product, i) => (
            <li key={product.slug} className="flex">
              <ProductCard product={product} index={i} showPrice={showPrices} ctaLabel={ctaLabel} />
            </li>
          ))}
        </ul>

        {note && <p className="font-display mt-10 max-w-2xl italic leading-relaxed text-subtle">{note}</p>}

        {links.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-6">
            {links.map((link, i) => (
              <Button key={i} {...linkProps(link)} tone={i === 0 ? 'primary' : 'outline'}>
                {link.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
