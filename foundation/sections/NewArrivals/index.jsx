import { P, Icon, Link, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import PieceCard from '#components/PieceCard.jsx'
import { toneClass } from '#components/tone.js'
import { arrivalDate } from '#utils/finds.js'
import { buttonLinks } from '#utils/links.js'

/**
 * The newest finds, set as a magazine spread: the latest piece large, the
 * next ones beside it, stepped down the page like prints pinned to a board.
 * The heading carries the date of the latest one, so the page says how fresh
 * it is without anyone updating the copy.
 *
 * Reads the `finds` query; shows its first `count` pieces.
 */
export default function NewArrivals({ content, params, block }) {
  const { pretitle, title, paragraphs } = content
  const links = buttonLinks(content || {})
  const { count = 3, tone = '' } = params
  const pieces = (content.data?.finds || []).slice(0, Math.max(1, Number(count) || 3))
  const [lead, ...rest] = pieces
  const latest = lead?.added ? arrivalDate(lead.added) : ''

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Shout pretitle={pretitle} title={title} block={block} size="md" />
          <div>
            {latest && (
              <p className="caps text-[0.625rem] text-heading">
                Latest find&ensp;<span className="font-display text-base font-medium normal-case italic tracking-normal text-accent-ink [font-stretch:normal]">{latest}</span>
              </p>
            )}
            {paragraphs.map((p, i) => (
              <P key={i} text={p} className="mt-4 max-w-md text-lg leading-relaxed text-body" />
            ))}
            {links[0] && (
              <Link href={links[0].href} className="text-cta mt-8">
                {links[0].label} <Icon name="lu-arrow-right" size="13" />
              </Link>
            )}
          </div>
        </div>

        {block.dataLoading ? (
          <div className="mt-16"><DataPlaceholder lines={6} /></div>
        ) : lead ? (
          <ul className={cn('mt-16 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2', rest.length && 'lg:grid-cols-[1.45fr_1fr_1fr]')}>
            <li className="sm:col-span-2 lg:col-span-1">
              <PieceCard piece={lead} isNew size="lg" eager />
            </li>
            {rest.map((piece, i) => (
              <li key={piece.slug || piece.$name} className={cn(i === 0 ? 'lg:mt-28' : 'lg:mt-56')}>
                <PieceCard piece={piece} isNew />
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-display mt-16 text-2xl italic text-subtle">
            New finds are on their way — in the meantime, the shop is open.
          </p>
        )}
      </div>
    </div>
  )
}
