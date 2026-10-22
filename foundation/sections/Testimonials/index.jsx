import { useEffect, useMemo, useState } from 'react'
import { Icon, Overlay, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'
import { intlLocale, useSay } from '#utils/locale.js'

const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000

/** "3 weeks ago" — the way Google dates its reviews — in the page's language. */
function timeAgo(date, now, locale) {
  const days = Math.max(0, Math.floor((now - date) / 86400000))
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (days < 7) return rtf.format(-days, 'day')
  if (days < 30) return rtf.format(-Math.floor(days / 7), 'week')
  if (days < 365) return rtf.format(-Math.max(1, Math.floor(days / 30.44)), 'month')
  return rtf.format(-Math.floor(days / 365), 'year')
}

/**
 * Reviews worth showing. A rating or a date is only judged when the review
 * has one: a review with neither (a quote copied from the old site) always
 * passes.
 */
function eligible(reviews, { minRating, maxAgeMonths, now }) {
  return reviews.filter((r) => {
    if (Number(r.rating) > 0 && Number(r.rating) < minRating) return false
    if (!r.date) return true
    const t = new Date(r.date).getTime()
    return !Number.isNaN(t) && now - t <= maxAgeMonths * MONTH_MS
  })
}

/** The review's words as plain text (authored fallbacks arrive as HTML). */
const plain = (html = '') => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()


/** Five stars, the earned ones filled. Nothing when the review has no rating. */
function Stars({ rating, size = '13' }) {
  const say = useSay()
  if (!(rating > 0)) return null
  const n = Math.min(5, rating)
  return (
    <div className="flex gap-0.5 text-accent-ink" role="img" aria-label={`${n} ${say('out of 5 stars')}`}>
      {Array.from({ length: 5 }, (_, s) => (
        <Icon
          key={s}
          name="lu-star"
          size={size}
          /* Lucide ships outline stars (fill="none"); CSS beats the
             presentation attribute, so this fills the earned ones. */
          className={s < n ? 'fill-current' : 'opacity-30'}
        />
      ))}
    </div>
  )
}

/** The whole review, over the page — for the ones the card cuts short. */
function FullReview({ card, onClose }) {
  const say = useSay()
  return (
    <Overlay onClose={onClose} className="items-center justify-center bg-ink/80 p-4 sm:p-8">
      <figure
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-full-name"
        className="context-light framed laid relative w-full max-w-2xl p-8 sm:p-12"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={say('Close review')}
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center text-heading transition-colors hover:text-accent-ink"
        >
          <Icon name="lu-x" size="18" />
        </button>
        <Stars rating={card.rating} size="15" />
        <blockquote className={cn('text-lg leading-relaxed text-heading sm:text-xl', card.rating > 0 && 'mt-6')}>
          “{card.text}”
        </blockquote>
        <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-2 border-t border-heading/20 pt-5">
          <span id="review-full-name" className="caps text-[0.6875rem] text-heading">{card.name}</span>
          {card.meta && <span className="text-sm text-subtle">{card.meta}</span>}
        </figcaption>
      </figure>
    </Overlay>
  )
}

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Review cards, kept compact: the heading and the "all reviews" link share a
 * row, and each card is stars (when the review has a rating), the words, and
 * the reviewer in wide capitals. A review longer than `excerpt` characters is
 * shown to a fixed height under a fade; the card grows a touch on hover to
 * say there is more, and pressing it opens the whole review. On phones
 * the cards sit in one row to swipe through.
 *
 * Two sources, in order of preference:
 *
 * 1. The `reviews` collection: filtered to `minRating`+ within the last
 *    `maxAgeMonths` (for reviews that have a rating or a date), then a random
 *    `pick` of them. The prerender can't know the visitor's "now" or roll their dice, so
 *    it draws the newest ones and the client reshuffles after mount.
 * 2. The authored `###` items, used only when the collection yields nothing.
 */
export default function Testimonials({ content, params, block }) {
  const { pretitle, title, items } = content
  const links = buttonLinks(content)
  const say = useSay()
  const locale = intlLocale(block.website)
  const { columns = 3, pick = 3, minRating = 4, maxAgeMonths = 12, excerpt = 160, showStars = true, showSource = true, tone = '' } = params
  const reviews = Array.isArray(content.data?.reviews) ? content.data.reviews : []
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' }

  const [now, setNow] = useState(null)
  const [picked, setPicked] = useState(null)
  const [open, setOpen] = useState(null) // the card being read in full

  /* Keyed on length, not the array: data can arrive as a fresh array each
     render, and reshuffling on every one would loop. */
  useEffect(() => {
    const t = Date.now()
    setNow(t)
    setPicked(shuffle(eligible(reviews, { minRating, maxAgeMonths, now: t })).slice(0, pick))
  }, [reviews.length, minRating, maxAgeMonths, pick]) // eslint-disable-line react-hooks/exhaustive-deps

  /* First paint (prerender + hydration): newest eligible, relative to build time. */
  const initial = useMemo(
    () => eligible(reviews, { minRating, maxAgeMonths, now: Date.now() }).slice(0, pick),
    [reviews.length, minRating, maxAgeMonths, pick] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const cards = reviews.length
    ? (picked || initial).map((r) => ({
        key: r.$name || `${r.author}-${r.date}`,
        rating: Number(r.rating) || 0,
        text: plain(r.text),
        name: r.author,
        meta: [
          r.source,
          r.date && (now ? timeAgo(new Date(r.date).getTime(), now, locale) : new Date(r.date).toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })),
        ].filter(Boolean).join(' · '),
      }))
    : []

  const fallback = items.map((item, i) => ({
    key: i,
    /* Five stars on every card regardless of what was said is a rating
       the component invented. Let the content carry it, default to 5. */
    rating: Number(item.data?.review?.rating ?? 5),
    text: plain(item.paragraphs.join(' ')),
    name: item.title,
    meta: item.subtitle,
  }))

  const shown = cards.length ? cards : fallback

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[calc(var(--section-padding-y)*0.75)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Shout pretitle={pretitle} title={title} block={block} size="md" />
          {links.map((l, i) => (
            <Button key={i} {...linkProps(l)} tone="outline">
              {l.label} <Icon name="lu-arrow-up-right" size="14" />
            </Button>
          ))}
        </div>

        {/* Phones: one row to swipe through, so three reviews do not stack into a tower. */}
        <ul className={cn('no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0', cols[columns] || cols[3])}>
          {shown.map((card, i) => {
            const rating = showStars ? Math.max(0, Math.min(5, card.rating || 0)) : 0
            const cut = excerpt > 0 && card.text.length > excerpt
            return (
              <li key={card.key} className="w-[82%] shrink-0 snap-start md:w-auto">
                <figure className={cn('framed group relative flex h-full flex-col p-6 sm:p-7', cut && 'review-grow')}>
                  <Stars rating={rating} />
                  <blockquote
                    className={cn(
                      'flex-1 leading-relaxed text-heading',
                      rating > 0 && 'mt-4',
                      /* Six lines under a fade; the card grows a touch on hover (styles.css). */
                      cut && 'review-fade max-h-[9.75rem] overflow-hidden'
                    )}
                  >
                    “{card.text}”
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-2 border-t border-heading/20 pt-4">
                    <span className="caps text-[0.625rem] text-heading">{card.name}</span>
                    {showSource && card.meta && <span className="text-xs text-subtle">{card.meta}</span>}
                    {cut && (
                      <Icon
                        name="lu-plus"
                        size="14"
                        aria-hidden="true"
                        className="ml-auto self-center text-subtle transition-transform duration-300 group-hover:rotate-90 group-hover:text-accent-ink"
                      />
                    )}
                  </figcaption>
                  {/* The whole card opens the full review. Laid over the card
                      rather than wrapping it: a button can't hold a blockquote. */}
                  {cut && (
                    <button
                      type="button"
                      onClick={() => setOpen(card)}
                      aria-haspopup="dialog"
                      aria-label={`${say('Read the full review from')} ${card.name}`}
                      className="absolute inset-0 z-10 cursor-pointer"
                    />
                  )}
                </figure>
              </li>
            )
          })}
        </ul>

        {open && <FullReview card={{ ...open, rating: showStars ? open.rating : 0, meta: showSource ? open.meta : '' }} onClose={() => setOpen(null)} />}
      </div>
    </div>
  )
}
