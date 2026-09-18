import { useState, useMemo, useCallback } from 'react'
import { P, Icon, Link, DataPlaceholder, useFetched, useWebsite, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import Lightbox from '#components/Lightbox.jsx'
import { money, duration } from '#components/money.js'
import { toneClass } from '#components/tone.js'

/** Photos shown on a row before the rest collapse into a "+N" tile. */
const STRIP = 4

const pad = (n) => String(n).padStart(2, '0')

/** "lu:palette" (collection) and "lu-palette" (markdown) both work. */
const iconName = (icon) => (icon || 'lu-scissors').replace(':', '-')

/**
 * A price note either reads ahead of the number ("from $70") or after it
 * ("$45, add-on"). Only the openers below move in front; the separator that
 * followed one goes with it, so "from — quoted at consult" splits cleanly.
 */
const OPENER = /^(from|starting at|starts at)\b[\s,.—–-]*/i

const splitNote = (note = '') => {
  const lead = note.match(OPENER)
  return lead ? [lead[1], note.slice(lead[0].length)] : ['', note]
}

/** The price as the menu shows it. A service priced 0 is quoted, not free. */
function Price({ service, className }) {
  const [lead, rest] = splitNote(service.priceNote)

  /* No number to quote: the note *is* the price ("Quoted at consult"), so it
     takes the number's place in the display face rather than hanging under a
     dash that says nothing. */
  if (!(Number(service.price) > 0)) {
    return (
      <p className={className}>
        <span className="font-display block text-2xl font-medium leading-tight tracking-tight text-heading first-letter:uppercase">
          {service.priceNote || '—'}
        </span>
      </p>
    )
  }

  return (
    <p className={className}>
      {/* Inline, not flex: the opener and the number share a baseline, and the
          caller's text-right keeps working. */}
      <span className="block">
        {lead && <span className="caps mr-2.5 text-[0.625rem] text-subtle">{lead}</span>}
        <span className="font-display text-4xl font-medium leading-none tracking-tight text-heading">
          {money(service.price)}
        </span>
      </span>
      {rest && <span className="caps mt-2 block text-[0.5625rem] text-subtle">{rest}</span>}
    </p>
  )
}

/**
 * Where a service's Book button goes: straight to that service on the Square
 * booking site when it has a `square:` ID, the full list (`bookHref`) when it
 * doesn't, and `enquireHref` for services that aren't booked online.
 */
function bookingLink(service, { squareBase, bookHref, enquireHref }) {
  if (service.bookable === false) return enquireHref
  return service.square && squareBase ? `${squareBase}/${service.square}` : bookHref
}

/**
 * The homepage teaser: three offering cards. `highlight` sets one of them in
 * vermilion — the colour block in a row of paper.
 */
function Cards({ services, highlight, highlightLabel, links }) {
  const cols = services.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
  return (
    <ul className={cn('mt-16 grid grid-cols-1 gap-8 lg:gap-10', cols)}>
      {services.map((s, i) => {
        const featured = i + 1 === Number(highlight)
        const href = bookingLink(s, links)
        return (
          <li key={s.slug} className={cn(featured && 'lg:-translate-y-6')}>
            <article className={cn('framed lift flex h-full flex-col p-8 sm:p-9', featured && 'tone tone-vermilion')}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-lg italic text-accent-ink" aria-hidden="true">No.&thinsp;{pad(i + 1)}</span>
                {featured && highlightLabel ? (
                  <span className="caps bg-heading px-2.5 py-1.5 text-[0.5625rem] text-section">{highlightLabel}</span>
                ) : (
                  <Icon name={iconName(s.icon)} size="20" className="text-subtle" />
                )}
              </div>
              <h3 className="font-display mt-10 text-[2rem] font-medium leading-[1.02] tracking-tight text-heading">{s.title}</h3>
              {s.tagline && <p className="font-display mt-3 text-lg italic leading-snug text-accent-ink">{s.tagline}</p>}
              {s.description && <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-body">{s.description}</p>}
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-heading/25 pt-6">
                <Price service={s} />
                <Link href={href} className="text-cta shrink-0">
                  {s.bookable === false ? 'Enquire' : 'Book'} <Icon name="lu-arrow-right" size="13" />
                </Link>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The price list, with the receipts. Reads the `services` collection.
 *
 * `layout: list` is the full menu, set like the price page of a lookbook: a
 * category filter and one ruled, numbered row per service, with the photos of
 * that service (from the `gallery` collection, matched on its `service:` slug)
 * opening in a lightbox. `layout: cards` is the homepage teaser.
 *
 * A section gets exactly one declaratively-bound collection, so services stays
 * bound and the gallery is fetched by path, through the kit's `useFetched`.
 */
export default function ServiceMenu({ content, params, block }) {
  const services = content.data?.services || []
  /* Optional `yaml:categories` block: [{ name, note }]. A note prints under
     that category's heading ("materials extra", "add on to your haircut"). */
  const notes = new Map((content.data?.categories || []).map((c) => [c.name, c.note]))
  const { pretitle, title, paragraphs } = content
  const {
    layout = 'list',
    bookHref = '/book',
    enquireHref = '/visit',
    showFilter = true,
    photosSource = '/data/gallery.json',
    highlight = 0,
    highlightLabel = 'Signature',
    note = '',
    tone = '',
  } = params
  const cards = layout === 'cards'
  const { website } = useWebsite()
  const links = { squareBase: website.config?.booking?.services, bookHref, enquireHref }

  const { data: fetchedPhotos } = useFetched(!cards && photosSource ? { path: photosSource } : null)
  const photosByService = useMemo(() => {
    const map = new Map()
    for (const photo of Array.isArray(fetchedPhotos) ? fetchedPhotos : []) {
      if (!photo.service) continue
      if (!map.has(photo.service)) map.set(photo.service, [])
      map.get(photo.service).push(photo)
    }
    return map
  }, [fetchedPhotos])

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))]
  const [active, setActive] = useState('All')
  const [viewing, setViewing] = useState(null) // { service, index }

  const viewingShots = viewing ? photosByService.get(viewing.service.slug) || [] : []
  const closeViewer = useCallback(() => setViewing(null), [])
  const stepViewer = useCallback(
    (delta) => setViewing((v) => {
      if (!v) return v
      const n = (photosByService.get(v.service.slug) || []).length
      return { ...v, index: (v.index + delta + n) % n }
    }),
    [photosByService]
  )

  if (block.dataLoading) return <DataPlaceholder lines={10} />

  const visible = active === 'All' ? services : services.filter((s) => s.category === active)

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className={cn(!cards && 'grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20')}>
          <Shout pretitle={pretitle} title={title} block={block} align={cards ? 'center' : 'left'}>
            {cards && paragraphs.map((p, i) => (
              <P key={i} text={p} className={cn('mx-auto max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
            ))}
          </Shout>
          {!cards && paragraphs.length > 0 && (
            <div>
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('leading-relaxed text-body', i > 0 && 'mt-4')} />
              ))}
            </div>
          )}
        </div>

        {cards ? (
          <Cards services={services} highlight={highlight} highlightLabel={highlightLabel} links={links} />
        ) : (
          <>
            {showFilter && categories.length > 1 && (
              <div className="mt-14 flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    aria-pressed={active === cat}
                    className={cn(
                      'caps border px-4 py-2.5 text-[0.625rem] transition-colors',
                      active === cat
                        ? 'border-heading bg-heading text-section'
                        : 'border-heading/25 text-heading hover:border-heading'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-10">
              {[...new Set(visible.map((s) => s.category))].map((category) => (
                <section key={category || 'all'} className="mt-16 first:mt-0" aria-label={category || undefined}>
                  {category && (
                    <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-heading pb-4">
                      <h3 className="font-display text-[1.75rem] font-semibold leading-none tracking-tight text-heading sm:text-4xl">{category}</h3>
                      {notes.get(category) && <p className="font-display text-base italic text-accent-ink">{notes.get(category)}</p>}
                    </header>
                  )}
                  <ul>
                    {visible.filter((s) => s.category === category).map((s) => {
                      const photos = photosByService.get(s.slug) || []
                      const number = services.indexOf(s) + 1
                      /* A bare line on the menu (name and price) sits tight; one with
                         copy or photos gets room to breathe. */
                      const roomy = s.description || photos.length > 0
                      return (
                        <li key={s.slug} className={cn('border-b border-heading/25', roomy ? 'py-10' : 'py-6')}>
                          <article className="grid gap-6 md:grid-cols-[4rem_1fr_auto] md:gap-10">
                            <span className="font-display hidden text-2xl italic leading-none text-accent-ink md:block" aria-hidden="true">
                              {pad(number)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h4 className={cn('font-display font-medium leading-tight tracking-tight text-heading', roomy ? 'text-3xl sm:text-[2.25rem]' : 'text-2xl sm:text-[1.75rem]')}>{s.title}</h4>
                                {s.featured && (
                                  <span className="caps bg-heading px-2.5 py-1.5 text-[0.5625rem] text-section">Signature</span>
                                )}
                              </div>
                              {s.tagline && <p className="font-display mt-2 text-lg italic text-accent-ink">{s.tagline}</p>}
                              {s.description && <p className="mt-4 max-w-2xl leading-relaxed text-body">{s.description}</p>}
                              {Number(s.duration) > 0 && (
                                <p className="caps mt-5 inline-flex items-center gap-1.5 text-[0.5625rem] text-subtle">
                                  <Icon name="lu-clock" size="12" /> {duration(s.duration)}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:justify-start">
                              <Price service={s} className="md:text-right" />
                              <Button href={bookingLink(s, links)} size="sm" tone={s.bookable === false ? 'outline' : 'primary'}>
                                {s.bookable === false ? 'Enquire' : 'Book'}
                              </Button>
                            </div>
                          </article>

                          {photos.length > 0 && (
                            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:ml-[6.5rem] md:max-w-3xl" aria-label={`Photos of ${s.title}`}>
                              {photos.slice(0, STRIP).map((photo, i) => {
                                const more = i === STRIP - 1 ? photos.length - STRIP : 0
                                return (
                                  <li key={photo.slug}>
                                    <button
                                      type="button"
                                      onClick={() => setViewing({ service: s, index: i })}
                                      aria-label={more > 0 ? `Open photos of ${s.title} — ${more} more` : `Open photo: ${photo.title}`}
                                      className="group/photo relative block w-full overflow-hidden bg-muted"
                                    >
                                      <img
                                        src={photo.image}
                                        alt=""
                                        loading="lazy"
                                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                                      />
                                      {more > 0 && (
                                        <span className="font-display absolute inset-0 grid place-items-center bg-vermilion/85 text-3xl italic text-paper">
                                          +{more}
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>

            {visible.length === 0 && <p className="mt-10 text-center text-subtle">Nothing in that category yet.</p>}
          </>
        )}

        {note && <p className="font-display mx-auto mt-14 max-w-xl text-center text-lg italic text-subtle">{note}</p>}

        {viewing && (
          <Lightbox shots={viewingShots} index={viewing.index} onClose={closeViewer} onStep={stepViewer} subtitle={viewing.service.title} />
        )}
      </div>
    </div>
  )
}
