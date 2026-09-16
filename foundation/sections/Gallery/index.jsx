import { useState, useCallback } from 'react'
import { P, Icon, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import Lightbox from '#components/Lightbox.jsx'
import { toneClass } from '#components/tone.js'

/** Hover bands cycle through the house colours, like swatches pinned to a board. */
const BANDS = ['tone-vermilion', 'tone-marigold', 'tone-green']

/**
 * The photo wall, laid out like a lookbook: an even grid of 4:5 frames, each
 * photo numbered as a look in reading order, with its caption on a band of
 * colour that rises on hover. A category filter, and a
 * lightbox with keyboard paging.
 *
 * `limit` lets the same section type serve both the teaser on the homepage and
 * the photos on another page.
 */
export default function Gallery({ content, params, block }) {
  const all = content.data?.gallery || []
  const { pretitle, title, paragraphs, links } = content
  const { columns = 3, limit = 0, showFilter = true, tone = '' } = params

  const [active, setActive] = useState('All')
  const [index, setIndex] = useState(null)

  const categories = [...new Set(all.map((s) => s.category).filter(Boolean))]
  const filtered = active === 'All' ? all : all.filter((s) => s.category === active)
  const shots = limit > 0 ? filtered.slice(0, limit) : filtered

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? null : (i + delta + shots.length) % shots.length)),
    [shots.length]
  )

  if (block.dataLoading) return <DataPlaceholder lines={10} />

  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }
  const shot = index === null ? null : shots[index]

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        {(pretitle || title) && (
          <Shout pretitle={pretitle} title={title} block={block}>
            {paragraphs.map((p, i) => (
              <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
            ))}
          </Shout>
        )}

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
            <button
              key={s.slug}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden bg-muted text-left"
              aria-label={`Open photo: ${s.title}`}
            >
              <img
                src={s.image}
                alt={s.title || ''}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="caps absolute left-3 top-3 bg-paper px-2 py-1 text-[0.5625rem] text-ink">
                Look {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'tone absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 px-4 py-3.5 transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0',
                  BANDS[i % BANDS.length]
                )}
              >
                <span className="font-display line-clamp-2 text-base italic leading-snug text-heading">{s.title}</span>
                <span className="caps shrink-0 text-[0.5625rem] text-heading">{s.category}</span>
              </span>
            </button>
          ))}
        </div>

        {shots.length === 0 && <p className="mt-10 text-center text-subtle">No photos in that category yet.</p>}

        {links.length > 0 && (
          <div className="mt-14 flex justify-center gap-4">
            {links.map((l, i) => (
              <Button key={i} href={l.href} tone={i === 0 ? 'primary' : 'outline'} size="lg">
                {l.label} <Icon name="lu-arrow-right" size="15" />
              </Button>
            ))}
          </div>
        )}

        <Lightbox shots={shots} index={index} onClose={close} onStep={step} subtitle={shot?.category} />
      </div>
    </div>
  )
}
