import { Span, cn } from '@uniweb/kit'

/**
 * The scrolling ticker. Content is a plain markdown list; the track is
 * duplicated so the CSS translate loops seamlessly. Hovering pauses it, and
 * prefers-reduced-motion stops it outright (see styles.css).
 *
 * Phrases alternate between Bodoni italic and wide capitals — the two voices
 * of the house — with a small star between them.
 */
function Marquee({ content, params }) {
  const phrases = (content.lists[0] || [])
    .map((item) => item.paragraphs?.[0])
    .filter(Boolean)
  if (phrases.length === 0) return null

  const { speed = 40, direction = 'left', tone = 'vermilion' } = params
  const track = [...phrases, ...phrases]

  const tones = {
    vermilion: 'bg-vermilion text-paper [--mark:var(--marigold)]',
    marigold: 'bg-marigold text-ink [--mark:var(--vermilion)]',
    green: 'bg-bottle text-paper [--mark:var(--marigold)]',
    ink: 'bg-ink text-paper [--mark:var(--marigold)]',
  }

  return (
    <div
      className={cn('ticker relative overflow-hidden border-y border-ink py-4', tones[tone] || tones.vermilion)}
      style={{ '--ticker-duration': `${speed}s` }}
    >
      <div className={cn('ticker-track items-center gap-8', direction === 'right' && 'ticker-reverse')} aria-hidden="true">
        {track.map((phrase, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8">
            <Span
              text={phrase}
              className={cn(
                'whitespace-nowrap',
                i % 2 === 0
                  ? 'font-display text-2xl font-medium italic leading-none sm:text-[1.75rem]'
                  : 'caps text-[0.6875rem] sm:text-xs'
              )}
            />
            <span className="text-lg leading-none text-[var(--mark)]">✦</span>
          </span>
        ))}
      </div>
      {/* The visual track is aria-hidden; this keeps the words in the a11y tree once. */}
      <span className="sr-only">{phrases.join('. ')}</span>
    </div>
  )
}

Marquee.className = 'p-0'

export default Marquee
