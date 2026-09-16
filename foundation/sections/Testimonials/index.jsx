import { useEffect, useMemo, useState } from 'react'
import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'

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
 * Review cards, set like pull quotes: an oversized Bodoni quotation mark, the
 * words in serif, and the reviewer in wide capitals. Cards are staggered, and
 * the middle one is set in vermilion.
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
  const { pretitle, title, items, links } = content
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
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <Shout pretitle={pretitle} title={title} block={block} align="center" />

        <ul className={cn('mt-16 grid grid-cols-1 items-start gap-8 lg:gap-10', cols[columns] || cols[3])}>
          {shown.map((card, i) => {
            const rating = Math.max(0, Math.min(5, card.rating || 0))
            const loud = shown.length >= 3 && i === 1
            return (
              <li key={card.key} className={cn(loud && 'lg:mt-12')}>
                <figure className={cn('framed flex h-full flex-col p-8 sm:p-9', loud && 'tone tone-vermilion')}>
                  <div className="flex items-start justify-between gap-4">
                    <span aria-hidden="true" className="font-display -mb-14 -mt-3 text-[8rem] leading-none text-accent-ink">“</span>
                    <div className="flex gap-0.5 pt-2 text-accent-ink" aria-label={`${rating} out of 5`}>
                      {Array.from({ length: 5 }, (_, s) => (
                        <Icon
                          key={s}
                          name="lu-star"
                          size="14"
                          /* Lucide ships outline stars (fill="none"); CSS beats the
                             presentation attribute, so this fills the earned ones. */
                          className={s < rating ? 'fill-current' : 'opacity-30'}
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="mt-8 flex-1">
                    {card.quote.map((p, j) => (
                      <P key={j} text={p} className="font-display text-xl leading-snug text-heading" />
                    ))}
                  </blockquote>
                  <figcaption className="mt-8 border-t border-heading/25 pt-5">
                    <span className="caps block text-[0.6875rem] text-heading">{card.name}</span>
                    {card.meta && <span className="mt-1 block text-sm text-subtle">{card.meta}</span>}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>

        {links.length > 0 && (
          <div className="mt-16 flex justify-center gap-4">
            {links.map((l, i) => (
              <Button key={i} href={l.href} tone="outline">
                {l.label} <Icon name="lu-arrow-up-right" size="14" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
