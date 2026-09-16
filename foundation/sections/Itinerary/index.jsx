import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'

/**
 * A timed run-of-show, drawn as the running order pinned up backstage:
 * "12:00 leave the office, 12:05 up the stairs…". Heading and copy on one
 * side, the card on the other — a paper card laid on the page at a slight
 * angle, whatever colour the section is.
 *
 * Each `###` item is one stop: the heading is the time, `####` the step, and
 * the paragraph a line of detail. The last stop is drawn as the finish.
 */
export default function Itinerary({ content, params, block }) {
  const { pretitle, title, paragraphs, links, items } = content
  const { cardTitle = '', tone = '' } = params

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <Shout pretitle={pretitle} title={title} block={block} size="md">
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
              ))}
            </Shout>
            {links.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {links.map((l, i) => (
                  <Button key={i} href={l.href} tone={i === 0 ? 'primary' : 'outline'}>
                    {l.label}
                    {i === 0 && <Icon name="lu-arrow-right" size="15" />}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            /* The card is always paper and ink, so it carries its own light context. */
            <div className="context-light relative mx-auto w-full max-w-lg bg-transparent lg:rotate-[1.25deg]">
              <div className="framed laid">
                <div className="flex items-center justify-between gap-4 border-b border-heading px-6 py-4 sm:px-8">
                  <span className="caps text-[0.625rem] text-heading">Running order</span>
                  {cardTitle && <span className="font-display text-lg italic text-accent-ink">{cardTitle}</span>}
                </div>
                <ol className="px-6 py-8 sm:px-8">
                  {items.map((item, i) => {
                    const last = i === items.length - 1
                    return (
                      <li key={i} className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr]">
                        <span className="font-display text-2xl font-medium leading-none tabular-nums text-heading sm:text-[1.75rem]">{item.title}</span>
                        <div className={cn('relative border-l pb-8 pl-6', last ? 'border-transparent pb-0' : 'border-heading/25')}>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute -left-[5px] top-1.5 size-[9px] rotate-45',
                              last ? 'bg-section ring-1 ring-vermilion' : 'bg-vermilion'
                            )}
                          />
                          {item.subtitle && <strong className="caps block text-[0.6875rem] text-heading">{item.subtitle}</strong>}
                          {item.paragraphs.map((p, j) => (
                            <P key={j} text={p} className="mt-1.5 text-[0.9375rem] leading-relaxed text-body" />
                          ))}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
