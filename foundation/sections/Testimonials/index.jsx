import { useEffect, useMemo, useState } from 'react'
import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000

/** "3 weeks ago" — the way Google dates its reviews. */
function timeAgo(date, now) {
  const days = Math.max(0, Math.floor((now - date) / 86400000))
  if (days < 1) return 'today'
  if (days < 7) return days === 1 ? 'yesterday' : `${days} days ago`
  if (days < 30) { const w = Math.floor(days / 7); return w === 1 ? 'a week ago' : `${w} weeks ago` }
  if (days < 365) { const m = Math.floor(days / 30.44); return m <= 1 ? 'a month ago' : `${m} months ago` }
  const y = Math.floor(days / 365)
  return y === 1 ? 'a year ago' : `${y} years ago`
}

function eligible(reviews, { minRating, maxAgeMonths, now }) {
  return reviews.filter((r) => {
    const t = new Date(r.date).getTime()
    return Number(r.rating) >= minRating && !Number.isNaN(t) && now - t <= maxAgeMonths * MONTH_MS
  })
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
 * row, and each card is stars, the words (clamped to four lines), and the
 * reviewer in wide capitals. The middle card is set in the brand colour. On phones
 * the cards sit in one row to swipe through.
 *
 * Two sources, in order of preference:
 *
 * 1. The `reviews` collection (standing in for a Google reviews feed): filtered
 *    to `minRating`+ within the last `maxAgeMonths`, then a random `pick` of
 *    them. The prerender can't know the visitor's "now" or roll their dice, so
 *    it draws the newest ones and the client reshuffles after mount.
 * 2. The authored `###` items, used only when the collection yields nothing.
 */
export default function Testimonials({ content, params, block }) {
  const { pretitle, title, items } = content
  const links = buttonLinks(content)
  const { columns = 3, pick = 3, minRating = 4, maxAgeMonths = 12, tone = '' } = params
  const reviews = Array.isArray(content.data?.reviews) ? content.data.reviews : []
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3' }

  const [now, setNow] = useState(null)
  const [picked, setPicked] = useState(null)

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
        key: r.slug || `${r.author}-${r.date}`,
        rating: Number(r.rating),
        quote: [r.text],
        name: r.author,
        meta: r.date ? `Google review · ${now ? timeAgo(new Date(r.date).getTime(), now) : new Date(r.date).toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' })}` : 'Google review',
      }))
    : []

  const fallback = items.map((item, i) => ({
    key: i,
    /* Five stars on every card regardless of what was said is a rating
       the component invented. Let the content carry it, default to 5. */
    rating: Number(item.data?.review?.rating ?? 5),
    quote: item.paragraphs,
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
            const rating = Math.max(0, Math.min(5, card.rating || 0))
            const loud = shown.length >= 3 && i === 1
            return (
              <li key={card.key} className="w-[82%] shrink-0 snap-start md:w-auto">
                <figure className={cn('framed flex h-full flex-col p-6 sm:p-7', loud && 'tone tone-brand')}>
                  <div className="flex gap-0.5 text-accent-ink" aria-label={`${rating} out of 5`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Icon
                        key={s}
                        name="lu-star"
                        size="13"
                        /* Lucide ships outline stars (fill="none"); CSS beats the
                           presentation attribute, so this fills the earned ones. */
                        className={s < rating ? 'fill-current' : 'opacity-30'}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1">
                    {card.quote.map((p, j) => (
                      <P key={j} text={p} className="line-clamp-4 leading-relaxed text-heading" />
                    ))}
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-2 border-t border-heading/20 pt-4">
                    <span className="caps text-[0.625rem] text-heading">{card.name}</span>
                    {card.meta && <span className="text-xs text-subtle">{card.meta}</span>}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
