import { Prose, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import { toneClass } from '#components/tone.js'

/**
 * Long-form reading: the house headline, then the rest of the markdown set as
 * running text in one readable column — sub-headings, lists, links and all.
 * For pages that are mostly words: privacy, accessibility, terms.
 *
 * The headline (label, title) is drawn by Shout; everything after it goes to
 * Prose in document order, so the author writes an ordinary document.
 *
 * `layout: side` pins the headline to the left on wide screens and runs the
 * text down the right, like the FAQ.
 */
export default function Article({ content, params, block }) {
  const { pretitle, title } = content
  const { layout = 'stacked', tone = '', updated = '', updatedLabel = 'Last updated' } = params
  const side = layout === 'side'

  /* The headline is the run of headings at the top of the sequence. */
  const start = content.sequence.findIndex((el) => el.type !== 'heading')
  const body = start < 0 ? [] : content.sequence.slice(start)

  return (
    <div className={toneClass(tone)}>
      <div className={cn('mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]', side && 'grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20')}>
        <div className={cn(side && 'lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start')}>
          <Shout pretitle={pretitle} title={title} block={block} size="md" />
          {updated && <p className="caps mt-6 text-[0.625rem] text-subtle">{updatedLabel ? `${updatedLabel} ` : ''}{updated}</p>}
        </div>
        <Prose
          content={{ ...content, sequence: body }}
          block={block}
          size="lg"
          className={cn('max-w-[68ch] border-t border-heading pt-10 prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-h2:mt-14 prose-a:text-link', !side && 'mt-12')}
        />
      </div>
    </div>
  )
}
