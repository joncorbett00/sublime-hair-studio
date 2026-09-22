import { P, Icon, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import PieceCard from '#components/PieceCard.jsx'
import { toneClass } from '#components/tone.js'
import { markOf, placeOf } from '#utils/finds.js'
import { buttonLinks } from '#utils/links.js'

/**
 * A grid of finds, newest first, each on its wardrobe tag; the newest few are
 * marked "Just in". `start` begins further down the list, so a page can lead
 * with the new arrivals and follow with the rest.
 *
 * "Just in" follows a piece's place among ALL the finds: from `all` when a page
 * sends the whole set beside a shorter list (a piece page's "more finds"),
 * else from the order `finds` arrives in, which is the query's own.
 */
export default function Finds({ content, params, block }) {
  const { pretitle, title, paragraphs } = content
  const links = buttonLinks(content || {})
  const { start = 1, count = 0, fresh = 3, columns = 3, tone = '' } = params

  const list = content.data?.finds || []
  const all = content.data?.all?.length ? content.data.all : list
  const from = Math.max(1, Number(start) || 1)
  const shown = list.slice(from - 1, count ? from - 1 + Number(count) : undefined)

  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  const hasHeader = pretitle || title || paragraphs.length > 0

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        {hasHeader && (
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <Shout pretitle={pretitle} title={title} block={block} size="md" />
            <div>
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-md text-lg leading-relaxed text-body', i > 0 && 'mt-4')} />
              ))}
              {links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {links.map((l, i) => (
                    <Button key={i} href={l.href} tone={i === 0 ? 'primary' : 'outline'} size="sm">
                      {l.label}
                      {i === 0 && <Icon name="lu-arrow-right" size="14" />}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {block.dataLoading ? (
          <div className="mt-14"><DataPlaceholder lines={6} /></div>
        ) : shown.length > 0 ? (
          <ul className={cn('grid grid-cols-1 gap-x-10 gap-y-16', hasHeader && 'mt-16', cols[columns] || cols[3])}>
            {shown.map((piece) => (
              <li key={piece.slug || piece.$name}>
                <PieceCard piece={piece} isNew={markOf(placeOf(piece, all), { fresh }) === 'new'} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-display mt-14 text-2xl italic text-subtle">
            New finds are on their way — in the meantime, the shop is open.
          </p>
        )}
      </div>
    </div>
  )
}
