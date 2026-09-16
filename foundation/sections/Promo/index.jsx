import { H2, P, Icon, cn } from '@uniweb/kit'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'

/**
 * A seasonal offer, set as a coupon across the page: a dashed tear-off edge
 * with the scissors on it, the offer figure in poster-sized Bodoni ("10%" with
 * an italic "off"), the headline and a line of terms, and the booking button.
 *
 * A short band rather than a full section, so it can sit straight under the
 * hero. Swap the copy each season; delete the file when there is no offer.
 */
export default function Promo({ content, params }) {
  const { pretitle, title, paragraphs, links } = content
  const { figure = '', figureLabel = '', note = '', tone = 'vermilion' } = params

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-4 py-7 sm:px-6 sm:py-9">
        <div className="relative border border-dashed border-heading/50 px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <span aria-hidden="true" className="absolute -top-3 left-8 bg-section px-2 text-heading sm:left-12">
            <Icon name="lu-scissors" size="20" />
          </span>

          <div className={cn('grid items-center gap-8 lg:gap-14', figure ? 'lg:grid-cols-[auto_1fr_auto]' : 'lg:grid-cols-[1fr_auto]')}>
            {figure && (
              <p className="font-display flex items-baseline gap-3 leading-[0.8] text-heading lg:border-r lg:border-heading/30 lg:pr-14">
                <span className="text-[clamp(5rem,11vw,9.5rem)] font-medium tracking-[-0.05em]">{figure}</span>
                {figureLabel && <span className="text-[clamp(2.25rem,4.5vw,3.75rem)] italic text-accent-ink">{figureLabel}</span>}
              </p>
            )}

            <div>
              {pretitle && (
                <p className="caps flex items-center gap-2.5 text-[0.6875rem] text-heading">
                  <span aria-hidden="true" className="text-accent-ink">✦</span>
                  {pretitle}
                </p>
              )}
              {title && (
                <H2
                  text={title}
                  className="font-display mt-4 text-heading text-[clamp(2rem,3.6vw,3rem)] font-medium tracking-[-0.02em] leading-[1]"
                />
              )}
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className="mt-4 max-w-xl leading-relaxed text-body" />
              ))}
            </div>

            {(links.length > 0 || note) && (
              <div className="flex flex-col items-start gap-4 lg:items-end">
                {links.map((l, i) => (
                  <Button key={i} href={l.href} size="lg" tone={i === 0 ? 'primary' : 'outline'}>
                    {l.label}
                    {i === 0 && <Icon name="lu-arrow-right" size="16" />}
                  </Button>
                ))}
                {note && <p className="caps text-[0.5625rem] text-subtle">{note}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
