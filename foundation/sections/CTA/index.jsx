import { H2, P, Icon, cn } from '@uniweb/kit'
import { oneLine } from '#utils/text.js'
import Button from '#components/Button.jsx'
import { Eyebrow } from '#components/Shout.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

/** Printer's crop marks in the corners — the page is ready to go to press. */
function CropMarks() {
  const mark = 'pointer-events-none absolute size-6 border-heading/50'
  return (
    <span aria-hidden="true">
      <span className={cn(mark, 'left-5 top-5 border-l border-t sm:left-8 sm:top-8')} />
      <span className={cn(mark, 'right-5 top-5 border-r border-t sm:right-8 sm:top-8')} />
      <span className={cn(mark, 'bottom-5 left-5 border-b border-l sm:bottom-8 sm:left-8')} />
      <span className={cn(mark, 'bottom-5 right-5 border-b border-r sm:bottom-8 sm:right-8')} />
    </span>
  )
}

/**
 * The closing invitation, set as a full colour block: a poster-sized headline,
 * a line of copy and one clear button, inside printer's crop marks.
 *
 * `align` sets it centred or ranged left, `size` a poster or a compact band,
 * and `marks` turns the crop marks off.
 */
export default function CTA({ content, params, block }) {
  const { pretitle, title, paragraphs } = content
  const links = buttonLinks(content)
  const { tone = 'brand', align = 'center', size = 'poster', marks = true } = params
  const center = align !== 'left'
  const compact = size === 'compact'

  return (
    <div className={cn('relative', toneClass(tone))}>
      {marks && <CropMarks />}
      <div
        className={cn(
          'relative mx-auto px-6',
          center ? 'max-w-5xl text-center' : 'max-w-[var(--max-content-width)] sm:px-12 lg:px-16',
          compact ? 'py-[calc(var(--section-padding-y)*0.7)]' : 'py-[calc(var(--section-padding-y)*1.15)]'
        )}
      >
        {pretitle && <Eyebrow block={block} className="mb-8">{pretitle}</Eyebrow>}
        <H2
          text={oneLine(title)}
          className={cn(
            'font-display text-heading text-balance font-medium tracking-[-0.035em]',
            compact ? 'text-[clamp(2.25rem,5vw,4rem)]' : 'text-[clamp(3rem,8.5vw,7.5rem)]',
            'leading-[0.9]'
          )}
        />
        {paragraphs.map((p, i) => (
          <P key={i} text={p} className={cn('mt-8 max-w-xl text-lg leading-relaxed text-body', center && 'mx-auto')} />
        ))}
        {links.length > 0 && (
          <div className={cn('flex flex-wrap items-center gap-4', compact ? 'mt-10' : 'mt-12', center && 'justify-center')}>
            {links.map((l, i) => (
              <Button key={i} {...linkProps(l)} size="lg" tone={i === 0 ? 'primary' : 'outline'}>
                {l.label}
                {i === 0 && <Icon name="lu-arrow-right" size="16" />}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
