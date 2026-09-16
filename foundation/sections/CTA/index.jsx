import { H2, P, Icon, cn } from '@uniweb/kit'
import Button from '#components/Button.jsx'
import { Eyebrow } from '#components/Shout.jsx'
import { toneClass } from '#components/tone.js'

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
 */
export default function CTA({ content, params, block }) {
  const { pretitle, title, paragraphs, links } = content
  const { tone = 'vermilion' } = params

  return (
    <div className={cn('relative', toneClass(tone))}>
      <CropMarks />
      <div className="relative mx-auto max-w-5xl px-6 py-[calc(var(--section-padding-y)*1.15)] text-center">
        {pretitle && <Eyebrow block={block} className="mb-8">{pretitle}</Eyebrow>}
        <H2
          text={title}
          className="font-display text-heading text-[clamp(3rem,8.5vw,7.5rem)]/[0.9] font-medium tracking-[-0.035em]"
        />
        {paragraphs.map((p, i) => (
          <P key={i} text={p} className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-body" />
        ))}
        {links.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {links.map((l, i) => (
              <Button key={i} href={l.href} size="lg" tone={i === 0 ? 'primary' : 'outline'}>
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
