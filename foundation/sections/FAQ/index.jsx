import { useState } from 'react'
import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import { toneClass } from '#components/tone.js'

/**
 * Questions people actually ask, as a numbered, ruled index: the heading sits
 * to the left on wide screens and the questions run down the right. The open
 * question turns italic, in the accent colour.
 */
export default function FAQ({ content, params, block }) {
  const { pretitle, title, paragraphs, items } = content
  const { tone = '' } = params
  const entries = content.data?.faq?.items || items
  const [open, setOpen] = useState(0)

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto grid max-w-[var(--max-content-width)] gap-12 px-6 py-[var(--section-padding-y)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start">
          <Shout pretitle={pretitle} title={title} block={block} size="md">
            {paragraphs.map((p, i) => (
              <P key={i} text={p} className="mt-6 text-lg leading-relaxed text-body" />
            ))}
          </Shout>
        </div>

        <ul className="border-t border-heading">
          {entries.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={i} className="border-b border-heading/25">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${block?.id ?? 'x'}-${i}`}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto]"
                  >
                    <span className="font-display text-sm italic text-subtle" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={cn(
                        'font-display text-xl leading-snug tracking-tight transition-colors sm:text-2xl',
                        isOpen ? 'italic text-accent-ink' : 'text-heading group-hover:text-accent-ink'
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center border transition-[transform,background-color,border-color] duration-300',
                        isOpen ? 'rotate-45 border-primary bg-primary text-primary-foreground' : 'border-heading/30 text-heading'
                      )}
                      aria-hidden="true"
                    >
                      <Icon name="lu-plus" size="16" />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-${block?.id ?? 'x'}-${i}`} className="pb-7 pl-[2.75rem] pr-12 sm:pl-[4.25rem]">
                    {item.paragraphs.map((p, j) => (
                      <P key={j} text={p} className="max-w-2xl leading-relaxed text-body [&:not(:first-child)]:mt-3" />
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
