import { useState } from 'react'
import { Link, Icon, Article, DataPlaceholder, useWebsite, cn } from '@uniweb/kit'
import Button from '#components/Button.jsx'
import PieceTag from '#components/PieceTag.jsx'
import { money } from '#components/money.js'
import { markOf, placeOf, arrivalDate, photo, photoSrcSet, enquiryHref } from '#utils/finds.js'

/** One ruled row of facts: a label in wide capitals, then the value. */
function Fact({ label, children }) {
  if (!children) return null
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-heading/20 py-3 last:border-0 sm:grid-cols-[9rem_1fr]">
      <dt className="caps pt-0.5 text-[0.5625rem] text-subtle">{label}</dt>
      <dd className="text-[0.9375rem] leading-snug text-heading">{children}</dd>
    </div>
  )
}

/**
 * A find's own page, at /finds/<slug>.
 *
 * The photo in a film-gate mat with its wardrobe tag, and any further photos
 * as a strip beneath it to choose from. Beside it: where it was worn, set on a
 * clapperboard slate; what it is, as ruled facts; the price; and the two ways
 * to have it — ask about it, or come in and try it on. No cart: the boutique
 * sells in person. The story of the piece runs underneath.
 *
 * `finds` holds this page's piece (the page's route query delivers it). `all`
 * is every find, so the page knows whether the piece is "Just in".
 */
export default function Piece({ content, params, block }) {
  const { website } = useWebsite()
  const { findsHref = '/finds', visitHref = '/visit', fresh = 3 } = params
  const piece = content.data?.finds?.[0]
  const all = content.data?.all || []
  const [shown, setShown] = useState(0)
  const email = website.config?.business?.email

  if (block.dataLoading) {
    return <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-24"><DataPlaceholder lines={10} /></div>
  }

  if (!piece) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-[var(--section-padding-y)] text-center">
        <p className="caps text-[0.625rem] text-subtle">No longer online</p>
        <h1 className="font-display mt-6 text-[clamp(2.5rem,5vw,4rem)]/[1] font-medium tracking-tight text-heading">
          This find is off the <span className="squiggle">website</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-body">
          We only show a handful of pieces online, and they change as new finds come in. This one may
          well still be in the shop — write to us and we'll check.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={findsHref} size="lg">See the latest finds <Icon name="lu-arrow-right" size="16" /></Button>
          {email && <Button href={`mailto:${email}`} tone="outline" size="lg">Write to us</Button>}
        </div>
      </div>
    )
  }

  const isNew = markOf(placeOf(piece, all), { fresh }) === 'new'
  const photos = [piece.image, ...(piece.photos || [])].filter(Boolean)
  const current = photos[Math.min(shown, photos.length - 1)]
  const enquire = enquiryHref(email, piece)

  return (
    <article className="mx-auto max-w-[var(--max-content-width)] px-6 pb-[var(--section-padding-y)] pt-10 lg:pt-14">
      <nav aria-label="Breadcrumb">
        <Link href={findsHref} className="text-cta">
          <Icon name="lu-arrow-left" size="13" /> All finds
        </Link>
      </nav>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* The photos. */}
        <div>
          <figure className="relative mx-auto max-w-xl lg:mx-0">
            <div className="mat gate">
              <span aria-hidden="true" className="halo" />
              <img
                src={photo(current, 1400)}
                srcSet={photoSrcSet(current, [600, 900, 1400])}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={shown === 0 ? piece.title : `${piece.title}, photo ${shown + 1}`}
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <PieceTag category={piece.category} isNew={isNew} className="absolute -left-3 top-8" />
            {(piece.scene || piece.production) && (
              <figcaption className="figcap mt-8">
                <b>{piece.scene || 'Take 1'}</b>&ensp;—&ensp;{piece.production}{piece.year ? `, ${piece.year}` : ''}
              </figcaption>
            )}
          </figure>

          {photos.length > 1 && (
            <ul className="mt-8 flex max-w-xl gap-3" aria-label="More photos">
              {photos.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setShown(i)}
                    aria-pressed={i === shown}
                    aria-label={`Show photo ${i + 1}`}
                    className={cn('block w-20 border p-1 transition-colors', i === shown ? 'border-heading' : 'border-heading/20 hover:border-heading/60')}
                  >
                    <img src={photo(src, 200)} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* What it is, where it was worn, and how to have it. */}
        <div className="lg:pt-4">
          {piece.production && (
            <p className="caps text-[0.625rem] text-subtle">
              Worn in <span className="font-display text-base font-medium normal-case italic tracking-normal text-accent-ink [font-stretch:normal]">{piece.production}</span>
            </p>
          )}
          <h1 className="font-display mt-4 text-[clamp(2.75rem,5vw,4.5rem)]/[0.95] font-medium tracking-[-0.03em] text-heading">
            {piece.title}
          </h1>
          {piece.description && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{piece.description}</p>
          )}

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-display text-4xl font-medium text-heading">{piece.price ? money(piece.price) : 'Price on request'}</span>
            <span className="caps text-[0.5625rem] text-subtle">One of one · in the boutique</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {enquire && (
              <Button href={enquire} size="lg">
                Ask about this piece <Icon name="lu-arrow-right" size="16" />
              </Button>
            )}
            <Button href={visitHref} tone="outline" size="lg">Come try it on</Button>
          </div>

          {/* The slate: where it was worn. */}
          {(piece.production || piece.worn) && (
            <div className="slate mt-12">
              <dl className="grid grid-cols-2 sm:grid-cols-[1.5fr_0.6fr_1fr]">
                <div className="border-b border-r border-heading px-4 py-3 sm:border-b-0">
                  <dt className="caps text-[0.5rem] text-subtle">Production</dt>
                  <dd className="font-display mt-1 text-lg font-medium italic leading-tight text-heading">{piece.production}</dd>
                </div>
                <div className="border-b border-heading px-4 py-3 sm:border-b-0 sm:border-r">
                  <dt className="caps text-[0.5rem] text-subtle">Year</dt>
                  <dd className="font-display mt-1 text-lg font-medium leading-tight text-heading">{piece.year}</dd>
                </div>
                <div className="col-span-2 px-4 py-3 sm:col-span-1">
                  <dt className="caps text-[0.5rem] text-subtle">Scene</dt>
                  <dd className="font-display mt-1 text-lg font-medium leading-tight text-heading">{piece.scene || '—'}</dd>
                </div>
              </dl>
              {piece.worn && (
                <div className="border-t border-heading px-4 py-3">
                  <p className="caps text-[0.5rem] text-subtle">Worn by</p>
                  <p className="mt-1 leading-snug text-heading">{piece.worn}</p>
                </div>
              )}
            </div>
          )}

          <dl className="mt-10 border-t border-heading">
            <Fact label="Montréal as">{piece.doubled}</Fact>
            <Fact label="Era">{piece.era}</Fact>
            <Fact label="Label · fabric">{piece.material}</Fact>
            <Fact label="Size">{piece.size}</Fact>
            <Fact label="Condition">{piece.condition}</Fact>
            <Fact label="Online since">{piece.added ? arrivalDate(piece.added, { year: true }) : ''}</Fact>
          </dl>
        </div>
      </div>

      {piece.content && (
        <div className="mt-20 grid gap-8 border-t border-heading pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <p className="caps text-[0.625rem] text-heading">From the wardrobe department</p>
          <div className="prose prose-lg max-w-none text-body [&_p]:leading-relaxed">
            <Article content={piece.content} />
          </div>
        </div>
      )}
    </article>
  )
}
