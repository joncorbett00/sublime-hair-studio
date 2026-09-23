import { useState } from 'react'
import { P, Span, Icon, Overlay, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'
import { linkProps } from '#utils/links.js'

const pad = (n) => String(n).padStart(2, '0')

const COLS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/** "renefurterer.com" from "https://www.renefurterer.com/…" — the button label for the brand's site. */
const host = (href = '') => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')

/**
 * The lines a studio carries, on the same framed shelf cards as the product
 * grid. A card holds the brand, where it comes from and one line about it;
 * pressing it opens a dialog with the whole story and a way out to the brand's
 * own site, so the grid stays short and the detail is one tap away.
 *
 * Each `###` item is one brand: the heading is its name, `####` where it is
 * from, the first paragraph the line on the card, the rest the story in the
 * dialog. A link is the brand's site; a photo is optional and tops the card.
 */
export default function Brands({ content, params, block }) {
  const { pretitle, title, paragraphs, items } = content
  const { columns = 4, note = '', moreLabel = 'Read more', tone = '' } = params
  const [open, setOpen] = useState(null)
  const brand = open === null ? null : items[open]

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
          {items.map((item, i) => {
            const image = item.images?.[0]
            return (
              <li key={i} className="flex">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="framed lift group flex h-full w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading"
                  aria-label={`Read more about ${item.title}`}
                >
                  {image && (
                    <img src={image.url || image.src} alt="" className="aspect-[4/3] w-full bg-muted object-cover" loading="lazy" />
                  )}
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="caps text-[0.5625rem] text-accent-ink">{item.subtitle}</span>
                      <span className="font-display shrink-0 text-sm italic text-subtle" aria-hidden="true">No.&thinsp;{pad(i + 1)}</span>
                    </div>
                    <h3 className="font-display mt-4 text-[2rem] font-medium leading-tight tracking-tight text-heading">
                      {item.title}
                    </h3>
                    {item.paragraphs[0] && <P text={item.paragraphs[0]} className="mt-4 leading-relaxed text-body" />}
                    <div className="mt-auto pt-7">
                      <span className="text-cta" aria-hidden="true">
                        {moreLabel} <Icon name="lu-arrow-right" size="13" />
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        {note && <p className="font-display mt-10 max-w-2xl italic leading-relaxed text-subtle">{note}</p>}

        {brand && (
          <Overlay onClose={() => setOpen(null)} className="items-center bg-ink/70 p-5">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="brand-name"
              className={cn(
                'context-light framed laid max-h-[88vh] w-full overflow-y-auto bg-section',
                brand.images?.[0] ? 'max-w-3xl' : 'max-w-xl'
              )}
            >
              <div className={cn(brand.images?.[0] && 'grid sm:grid-cols-[15rem_1fr]')}>
                {brand.images?.[0] && (
                  <img src={brand.images[0].url || brand.images[0].src} alt="" className="h-60 w-full object-cover sm:h-full" />
                )}
                <div className="p-7 sm:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="caps text-[0.5625rem] text-accent-ink">{brand.subtitle}</p>
                      <h2 id="brand-name" className="font-display mt-2 text-4xl font-medium tracking-tight text-heading sm:text-5xl">
                        {brand.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(null)}
                      aria-label="Close"
                      className="grid size-10 shrink-0 place-items-center border border-heading/30 text-heading hover:bg-muted"
                    >
                      <Icon name="lu-x" size="18" />
                    </button>
                  </div>

                  {brand.paragraphs[0] && (
                    <p className="font-display mt-6 border-b border-heading/25 pb-6 text-xl italic leading-snug text-heading">
                      <Span text={brand.paragraphs[0]} />
                    </p>
                  )}
                  {brand.paragraphs.slice(1).map((p, j) => (
                    <P key={j} text={p} className="mt-5 leading-relaxed text-body" />
                  ))}

                  {brand.links?.[0] && (
                    <div className="mt-8">
                      <Button {...linkProps(brand.links[0])} tone="outline">
                        {host(brand.links[0].href) || brand.links[0].label} <Icon name="lu-arrow-up-right" size="15" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  )
}
