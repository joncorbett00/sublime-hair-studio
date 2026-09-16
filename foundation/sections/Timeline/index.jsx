import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'

/**
 * A career in chapters: a hairline running down the page with a vermilion
 * diamond at each stop, the year in poster-sized Bodoni, and a matted photo
 * from that part of the story. Photos alternate sides on wide screens, like
 * the spreads of a retrospective; on phones everything runs down one side of
 * the line.
 *
 * Each `###` item is one chapter: the heading is the year (or "Today"), `####`
 * the headline, then a paragraph and one photo — its alt text is the caption.
 */
export default function Timeline({ content, params, block }) {
  const { pretitle, title, paragraphs, links, items } = content
  const { tone = '' } = params

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <Shout pretitle={pretitle} title={title} block={block} />
          {(paragraphs.length > 0 || links.length > 0) && (
            <div>
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('text-lg leading-relaxed text-body', i > 0 && 'mt-4')} />
              ))}
              {links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {links.map((l, i) => (
                    <Button key={i} href={l.href} tone={i === 0 ? 'primary' : 'outline'}>
                      {l.label}
                      {i === 0 && <Icon name="lu-arrow-right" size="15" />}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <ol className="relative mt-20 lg:mt-28">
          {/* The line the chapters hang from. */}
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-2 w-px bg-heading/30 lg:left-1/2" />

          {items.map((item, i) => {
            const image = item.images?.[0]
            const photoFirst = i % 2 === 1
            return (
              <li key={i} className="relative grid gap-8 pb-20 pl-10 last:pb-0 lg:grid-cols-2 lg:gap-28 lg:pl-0 lg:pb-28">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 size-[11px] rotate-45 bg-vermilion ring-4 ring-[var(--section)] lg:left-1/2 lg:-translate-x-[5px]"
                />

                <div className={cn('lg:pt-0', photoFirst ? 'lg:order-2' : 'lg:text-right')}>
                  <p className="font-display text-[clamp(3.5rem,7vw,6rem)] font-medium italic leading-[0.9] tracking-[-0.03em] text-accent-ink">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <h3 className="font-display mt-5 text-3xl font-medium leading-tight tracking-tight text-heading">{item.subtitle}</h3>
                  )}
                  {item.paragraphs.map((p, j) => (
                    <P
                      key={j}
                      text={p}
                      className={cn('mt-4 max-w-md leading-relaxed text-body', !photoFirst && 'lg:ml-auto')}
                    />
                  ))}
                </div>

                {image && (
                  <figure className={cn('w-full max-w-md', photoFirst ? 'lg:order-1 lg:ml-auto' : '')}>
                    <div className="mat">
                      <img
                        src={image.url || image.src}
                        alt={image.alt || ''}
                        className="aspect-[5/4] w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {image.alt && (
                      <figcaption className="figcap mt-4">
                        <b>Fig.</b>&ensp;{image.alt}
                      </figcaption>
                    )}
                  </figure>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
