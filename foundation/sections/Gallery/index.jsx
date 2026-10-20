import { useState, useCallback, useRef } from 'react'
import { P, Icon, Overlay, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import Lightbox from '#components/Lightbox.jsx'
import useRow from '#components/useRow.js'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

/** Hover bands alternate the brand colour and ink. */
const BANDS = ['tone-brand', 'tone-ink']

/** The wall's "every category" choice — a value no category can be. */
const ALL = Symbol('all')

/** The shape of every photo on the wall (`aspect`). */
const ASPECTS = { portrait: 'aspect-[4/5]', square: 'aspect-square', landscape: 'aspect-[4/3]' }

/** One photo: numbered as a look, its caption on a band of colour that rises on hover. */
function Look({ shot, index, onOpen, badge, aspect }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden bg-muted text-left"
      aria-label={`Open photo: ${shot.title}`}
    >
      <img
        src={shot.image}
        alt={shot.title || ''}
        className={cn(ASPECTS[aspect] || ASPECTS.portrait, 'w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]')}
        loading="lazy"
        draggable="false"
      />
      {badge && (
        <span className="caps absolute left-3 top-3 bg-paper px-2 py-1 text-[0.5625rem] text-ink">
          {badge} {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <span
        className={cn(
          'tone absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 px-4 py-3.5 transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0',
          BANDS[index % BANDS.length]
        )}
      >
        <span className="line-clamp-2 text-sm font-medium leading-snug text-heading">{shot.title}</span>
        <span className="caps shrink-0 text-[0.5625rem] text-heading">{shot.category}</span>
      </span>
    </button>
  )
}

/** The category filter: "All" (`allLabel`) plus each category in the photos. The "All" choice is kept as null, so its words can change. */
function Filter({ categories, active, onPick, allLabel, className }) {
  if (categories.length < 2) return null
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filter photos by category">
      {[null, ...categories].map((cat) => (
        <button
          key={cat ?? 'all'}
          type="button"
          onClick={() => onPick(cat)}
          aria-pressed={active === cat}
          className={cn(
            'caps border px-4 py-2.5 text-[0.625rem] transition-colors',
            active === cat
              ? 'border-heading bg-heading text-section'
              : 'border-heading/25 text-heading hover:border-heading'
          )}
        >
          {cat ?? allLabel}
        </button>
      ))}
    </div>
  )
}

/**
 * Every photo, in a full-screen sheet over the page: the whole collection
 * with its category filter, whatever the section itself shows. A photo opens
 * in the lightbox on top of it; closing that comes back here.
 */
function Wall({ shots, categories, active, onPick, onOpen, onClose, title, label, lookProps }) {
  return (
    <Overlay onClose={onClose} className="items-stretch justify-center bg-ink/85 p-0 sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-wall-title"
        className="context-light flex w-full max-w-[var(--max-content-width)] flex-col bg-section"
      >
        <div className="flex items-center justify-between gap-6 border-b border-heading/15 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            {label && <p className="caps text-[0.5625rem] text-subtle">{label.replace('{count}', String(shots.length).padStart(2, '0'))}</p>}
            <h2 id="gallery-wall-title" className="font-display mt-1 truncate text-2xl font-medium tracking-tight text-heading sm:text-3xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the gallery"
            className="grid size-11 shrink-0 place-items-center border border-heading text-heading transition-colors hover:bg-heading hover:text-section"
          >
            <Icon name="lu-x" size="18" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-6 sm:px-8">
          <Filter categories={categories} active={active} onPick={onPick} allLabel={lookProps.allLabel} />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {shots.map((s, i) => (
              <Look key={s.slug} shot={s} index={i} onOpen={() => onOpen(i)} badge={lookProps.badge} aspect={lookProps.aspect} />
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

/**
 * The photo wall, laid out like a lookbook, with a lightbox that pages with
 * the arrow keys.
 *
 * `layout: grid` is an even grid of 4:5 frames with an optional category
 * filter. `layout: carousel` is a single row that scrolls sideways (swipe,
 * trackpad, or the arrows beside the heading), for a teaser that should not
 * take over the page. `limit` caps the photos either way. `showAll` adds a
 * button that opens every photo in a full-screen sheet (Wall).
 */
export default function Gallery({ content, params, block }) {
  const all = content.data?.gallery || []
  const { pretitle, title, paragraphs } = content
  const links = buttonLinks(content)
  const {
    layout = 'grid',
    columns = 3,
    aspect = 'portrait',
    limit = 0,
    showFilter = true,
    showAll = false,
    showAllLabel = 'See all the work',
    badgeLabel = 'Look',
    allLabel = 'All',
    wallLabel = 'All the work · {count} photos',
    emptyText = 'No photos in that category yet.',
    closeLabel = 'Close',
    tone = '',
  } = params
  const lookProps = { badge: badgeLabel, aspect, allLabel }
  const carousel = layout === 'carousel'

  const [active, setActive] = useState(null) // the category filter; null is all of them
  const [index, setIndex] = useState(null)
  const [wall, setWall] = useState(null) // the wall's category (ALL for every one), while it is open
  const trackRef = useRef(null)

  const categories = [...new Set(all.map((s) => s.category).filter(Boolean))]
  const filtered = active === null ? all : all.filter((s) => s.category === active)
  const shots = limit > 0 ? filtered.slice(0, limit) : filtered
  const row = useRow(trackRef, shots.length)
  const wallShots = wall === null || wall === ALL ? all : all.filter((s) => s.category === wall)
  // The lightbox pages through whichever set the photo was opened from.
  const viewing = wall === null ? shots : wallShots

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? null : (i + delta + viewing.length) % viewing.length)),
    [viewing.length]
  )

  if (block.dataLoading) return <DataPlaceholder lines={10} />

  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }
  const shot = index === null ? null : viewing[index]
  const arrow = 'grid size-12 place-items-center border border-heading text-heading transition-colors hover:bg-heading hover:text-section disabled:pointer-events-none disabled:opacity-30'

  const heading = (pretitle || title) && (
    <Shout pretitle={pretitle} title={title} block={block} size={carousel ? 'md' : 'lg'}>
      {paragraphs.map((p, i) => (
        <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
      ))}
    </Shout>
  )

  const openWall = showAll && all.length > shots.length
  const buttons = (links.length > 0 || openWall) && (
    <div className={cn('flex flex-wrap gap-4', !carousel && 'mt-14 justify-center')}>
      {openWall && (
        <Button onClick={() => setWall(ALL)} tone={carousel ? 'outline' : 'primary'} size={carousel ? 'md' : 'lg'} aria-haspopup="dialog">
          {showAllLabel} <span className="opacity-60">{all.length}</span>
        </Button>
      )}
      {links.map((l, i) => (
        <Button key={i} {...linkProps(l)} tone={i === 0 ? (carousel ? 'outline' : 'primary') : 'outline'} size={carousel ? 'md' : 'lg'}>
          {l.label} <Icon name="lu-arrow-right" size="15" />
        </Button>
      ))}
    </div>
  )

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        {carousel ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-8">
              {heading}
              {shots.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {buttons}
                  <button type="button" onClick={() => row.move(-1)} disabled={row.start} aria-label="Previous photos" className={cn(arrow, 'ml-3')}>
                    <Icon name="lu-arrow-left" size="18" />
                  </button>
                  <button type="button" onClick={() => row.move(1)} disabled={row.end} aria-label="Next photos" className={arrow}>
                    <Icon name="lu-arrow-right" size="18" />
                  </button>
                </div>
              )}
            </div>

            <ul
              ref={trackRef}
              aria-label={title ? undefined : 'Recent work'}
              className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain"
            >
              {shots.map((s, i) => (
                <li key={s.slug} className="w-[72%] shrink-0 snap-start xs:w-[46%] md:w-[31%] lg:w-[calc((100%-3*1.25rem)/4)]">
                  <Look shot={s} index={i} onOpen={() => setIndex(i)} badge={badgeLabel} aspect={aspect} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            {heading}

            {showFilter && (
              <Filter categories={categories} active={active} onPick={(cat) => { setActive(cat); setIndex(null) }} allLabel={allLabel} className="mt-12" />
            )}

            <div className={cn('mt-14 grid grid-cols-1 gap-6', colClass[columns] || colClass[3])}>
              {shots.map((s, i) => (
                <Look key={s.slug} shot={s} index={i} onOpen={() => setIndex(i)} badge={badgeLabel} aspect={aspect} />
              ))}
            </div>

            {buttons}
          </>
        )}

        {shots.length === 0 && emptyText && <p className="mt-10 text-center text-subtle">{emptyText}</p>}

        {wall !== null && (
          <Wall
            shots={wallShots}
            categories={categories}
            active={wall === ALL ? null : wall}
            onPick={(cat) => { setWall(cat ?? ALL); setIndex(null) }}
            onOpen={setIndex}
            onClose={() => { setWall(null); setIndex(null) }}
            label={wallLabel}
            lookProps={lookProps}
            title={Array.isArray(title) ? title.join(' ').replace(/<[^>]+>/g, '') : String(title || 'Recent work').replace(/<[^>]+>/g, '')}
          />
        )}

        <Lightbox shots={viewing} index={index} onClose={close} onStep={step} subtitle={shot?.category} closeLabel={closeLabel} />
      </div>
    </div>
  )
}
