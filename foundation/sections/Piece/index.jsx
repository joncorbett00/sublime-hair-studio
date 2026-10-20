import { useState } from 'react'
import { H1, P, Link, Icon, Article, DataPlaceholder, useWebsite, cn } from '@uniweb/kit'
import { oneLine } from '#utils/text.js'
import Button from '#components/Button.jsx'
import PieceTag from '#components/PieceTag.jsx'
import { money } from '#components/money.js'
import { markOf, placeOf, arrivalDate, photo, photoSrcSet, enquiryHref } from '#utils/finds.js'
import { frameClass } from '#components/frame.js'
import { buttonLinks, linkProps } from '#utils/links.js'

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
 * The photo in a soft-cornered mat with its swing tag, and any further photos
 * as a strip beneath it to choose from. Beside it: its label, what it is, the
 * price, the two ways to have it — ask about it, or come in and try it on —
 * and the facts, as ruled rows. No cart: the boutique sells in person. The
 * story of the piece runs underneath.
 *
 * `finds` holds this page's piece (the page's route query delivers it). `all`
 * is every find, so the page knows whether the piece is "Just in".
 *
 * Every label on the page is a setting. The section's own markdown is the
 * message shown when a piece has come off the website (an old link): its
 * label, heading, a paragraph and buttons.
 */
export default function Piece({ content, params, block }) {
  const { website } = useWebsite()
  const {
    findsHref = '/finds',
    visitHref = '/visit',
    fresh = 3,
    frame = 'gate',
    backLabel = 'All finds',
    newLabel = 'Just in',
    priceOnRequest = 'Price on request',
    availability = 'One of one · in the boutique',
    enquireLabel = 'Ask about this piece',
    visitLabel = 'Come try it on',
    writeLabel = 'Write to us',
    foundLabel = 'Found',
    storyLabel = 'The story',
    factLabel = 'Label',
    factEra = 'Era',
    factFabric = 'Fabric',
    factSize = 'Size',
    factCondition = 'Condition',
    factAdded = 'Online since',
    enquirySubject = 'About the {piece}',
    enquiryMessage = "Is the {piece} still in the shop? I'd like to come in and try it on.",
  } = params
  const piece = content.data?.finds?.[0]
  const all = content.data?.all || []
  const [shown, setShown] = useState(0)
  const email = website.config?.business?.email

  if (block.dataLoading) {
    return <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-24"><DataPlaceholder lines={10} /></div>
  }

  if (!piece) {
    const links = buttonLinks(content)
    return (
      <div className="mx-auto max-w-3xl px-6 py-[var(--section-padding-y)] text-center">
        {content.pretitle && <p className="caps text-[0.625rem] text-subtle">{content.pretitle}</p>}
        {content.title && (
          <H1 text={oneLine(content.title)} className="font-display mt-6 text-balance text-[clamp(2.5rem,5vw,4rem)]/[1] font-medium tracking-tight text-heading" />
        )}
        {content.paragraphs.map((p, i) => (
          <P key={i} text={p} className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-body" />
        ))}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {links.map((l, i) => (
            <Button key={i} {...linkProps(l)} size="lg" tone={i === 0 ? 'primary' : 'outline'}>
              {l.label} {i === 0 && <Icon name="lu-arrow-right" size="16" />}
            </Button>
          ))}
          {email && writeLabel && <Button href={`mailto:${email}`} tone="outline" size="lg">{writeLabel}</Button>}
        </div>
      </div>
    )
  }

  const isNew = markOf(placeOf(piece, all), { fresh }) === 'new'
  const photos = [piece.image, ...(piece.photos || [])].filter(Boolean)
  const current = photos[Math.min(shown, photos.length - 1)]
  const enquire = enquiryHref(email, piece, { site: String(website.name || '').split(' ')[0], subject: enquirySubject, message: enquiryMessage })

  return (
    <article className="mx-auto max-w-[var(--max-content-width)] px-6 pb-[var(--section-padding-y)] pt-10 lg:pt-14">
      <nav aria-label="Breadcrumb">
        <Link href={findsHref} className="text-cta">
          <Icon name="lu-arrow-left" size="13" /> {backLabel}
        </Link>
      </nav>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* The photos. */}
        <div>
          <figure className="relative mx-auto max-w-xl lg:mx-0">
            <div className={cn('mat', frameClass(frame))}>
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
            <PieceTag category={piece.category} isNew={isNew} newLabel={newLabel} className="absolute -left-3 top-8" />
            {piece.found && (
              <figcaption className="figcap mt-8">
                {foundLabel && <><b>{foundLabel}</b>&ensp;—&ensp;</>}{piece.found}
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

        {/* What it is and how to have it. */}
        <div className="lg:pt-4">
          {(piece.designer || piece.era) && (
            <p className="caps text-[0.625rem] text-subtle">
              {piece.designer && <span className="font-display text-base font-medium normal-case italic tracking-normal text-accent-ink [font-stretch:var(--display-stretch)]">{piece.designer}</span>}
              {piece.designer && piece.era ? <>&ensp;·&ensp;</> : null}
              {piece.era}
            </p>
          )}
          <h1 className="font-display mt-4 text-[clamp(2.75rem,5vw,4.5rem)]/[0.95] font-medium tracking-[-0.03em] text-heading">
            {piece.title}
          </h1>
          {piece.description && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{piece.description}</p>
          )}

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-display text-4xl font-medium text-heading">{piece.price ? money(piece.price) : priceOnRequest}</span>
            {availability && <span className="caps text-[0.5625rem] text-subtle">{availability}</span>}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {enquire && (
              <Button href={enquire} size="lg">
                {enquireLabel} <Icon name="lu-arrow-right" size="16" />
              </Button>
            )}
            {visitLabel && <Button href={visitHref} tone="outline" size="lg">{visitLabel}</Button>}
          </div>

          <dl className="mt-10 border-t border-heading">
            <Fact label={factLabel}>{piece.designer}</Fact>
            <Fact label={factEra}>{piece.era}</Fact>
            <Fact label={factFabric}>{piece.material}</Fact>
            <Fact label={factSize}>{piece.size}</Fact>
            <Fact label={factCondition}>{piece.condition}</Fact>
            <Fact label={factAdded}>{piece.added ? arrivalDate(piece.added, { year: true }) : ''}</Fact>
          </dl>
        </div>
      </div>

      {piece.content && (
        <div className="mt-20 grid gap-8 border-t border-heading pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <p className="caps text-[0.625rem] text-heading">{storyLabel}</p>
          <div className="prose prose-lg max-w-none text-body [&_p]:leading-relaxed">
            <Article content={piece.content} />
          </div>
        </div>
      )}
    </article>
  )
}
