import { useState, useCallback, useEffect, useRef } from 'react'
import { P, Icon, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import Lightbox from '#components/Lightbox.jsx'
import { toneClass } from '#components/tone.js'

/** Hover bands alternate vermilion and ink. */
const BANDS = ['tone-vermilion', 'tone-ink']

/** One photo: numbered as a look, its caption on a band of colour that rises on hover. */
function Look({ shot, index, onOpen }) {
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
        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
        draggable="false"
      />
      <span className="caps absolute left-3 top-3 bg-paper px-2 py-1 text-[0.5625rem] text-ink">
        Look {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'tone absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 px-4 py-3.5 transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0',
          BANDS[index % BANDS.length]
        )}
      >
        <span className="font-display line-clamp-2 text-base italic leading-snug text-heading">{shot.title}</span>
        <span className="caps shrink-0 text-[0.5625rem] text-heading">{shot.category}</span>
      </span>
    </button>
  )
}

/**
 * Previous / next for the carousel. Each press moves one photo; a button is
 * disabled at its end of the row.
 */
function useRow(trackRef, count) {
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
  }, [trackRef])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [trackRef, measure, count])

  const move = useCallback((dir) => {
    const el = trackRef.current
    const item = el?.firstElementChild
    if (!item) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' })
  }, [trackRef])

  return { ...edges, move }
}

/**
 * The photo wall, laid out like a lookbook, with a lightbox that pages with
 * the arrow keys.
 *
 * `layout: grid` is an even grid of 4:5 frames with an optional category
 * filter. `layout: carousel` is a single row that scrolls sideways (swipe,
 * trackpad, or the arrows beside the heading), for a teaser that should not
 * take over the page. `limit` caps the photos either way.
 */
export default function Gallery({ content, params, block }) {
  const all = content.data?.gallery || []
  const { pretitle, title, paragraphs, links } = content
  const { layout = 'grid', columns = 3, limit = 0, showFilter = true, tone = '' } = params
  const carousel = layout === 'carousel'

  const [active, setActive] = useState('All')
  const [index, setIndex] = useState(null)
  const trackRef = useRef(null)

  const categories = [...new Set(all.map((s) => s.category).filter(Boolean))]
  const filtered = active === 'All' ? all : all.filter((s) => s.category === active)
  const shots = limit > 0 ? filtered.slice(0, limit) : filtered
  const row = useRow(trackRef, shots.length)

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? null : (i + delta + shots.length) % shots.length)),
    [shots.length]
  )

  if (block.dataLoading) return <DataPlaceholder lines={10} />

  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }
  const shot = index === null ? null : shots[index]
  const arrow = 'grid size-12 place-items-center border border-heading text-heading transition-colors hover:bg-heading hover:text-section disabled:pointer-events-none disabled:opacity-30'

  const heading = (pretitle || title) && (
    <Shout pretitle={pretitle} title={title} block={block} size={carousel ? 'md' : 'lg'}>
      {paragraphs.map((p, i) => (
        <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
      ))}
    </Shout>
  )

  const buttons = links.length > 0 && (
    <div className={cn('flex gap-4', !carousel && 'mt-14 justify-center')}>
      {links.map((l, i) => (
        <Button key={i} href={l.href} tone={i === 0 ? (carousel ? 'outline' : 'primary') : 'outline'} size={carousel ? 'md' : 'lg'}>
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
                  <Look shot={s} index={i} onOpen={() => setIndex(i)} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            {heading}

            {showFilter && categories.length > 1 && (
              <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter photos by category">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setActive(cat); setIndex(null) }}
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

            <div className={cn('mt-14 grid grid-cols-1 gap-6', colClass[columns] || colClass[3])}>
              {shots.map((s, i) => (
                <Look key={s.slug} shot={s} index={i} onOpen={() => setIndex(i)} />
              ))}
            </div>

            {buttons}
          </>
        )}

        {shots.length === 0 && <p className="mt-10 text-center text-subtle">No photos in that category yet.</p>}

        <Lightbox shots={shots} index={index} onClose={close} onStep={step} subtitle={shot?.category} />
      </div>
    </div>
  )
}
