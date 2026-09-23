import { P, Span, Icon, Link, cn } from '@uniweb/kit'
import { linkProps } from '#utils/links.js'

/**
 * A small aside — the kind of thing pinned by the till. A hairline card with a
 * label, one short heading, a sentence and a text link, set well below the
 * poster-sized sections around it so it reads as a footnote, not a pitch.
 */
export default function Note({ content, params }) {
  const { pretitle, title, paragraphs, links } = content
  const { align = 'center' } = params
  const center = align === 'center'

  return (
    <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-14">
      <aside className={cn('max-w-xl border border-heading/25 px-7 py-6', center ? 'mx-auto text-center' : '')}>
        {pretitle && <p className="caps text-[0.5625rem] text-subtle">{pretitle}</p>}
        {title && (
          <p className="font-display mt-2 text-xl font-medium italic leading-snug text-heading">
            <Span text={Array.isArray(title) ? title.join(' ') : title} />
          </p>
        )}
        {paragraphs.map((p, i) => (
          <P key={i} text={p} className="mt-2 text-sm leading-relaxed text-body" />
        ))}
        {links[0] && (
          <Link {...linkProps(links[0])} className={cn('text-cta mt-4', center && 'justify-center')}>
            {links[0].label} <Icon name="lu-arrow-right" size="13" />
          </Link>
        )}
      </aside>
    </div>
  )
}
