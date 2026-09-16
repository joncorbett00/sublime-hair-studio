import { H1, H2, cn } from '@uniweb/kit'

/**
 * Section headline: the numbered eyebrow and the poster-sized heading. Used by most
 * sections so the rhythm is identical site-wide.
 *
 * The number is the section's place on its page — "No. 03" — the way a
 * magazine numbers its stories. It is decoration, so screen readers skip it.
 *
 * Pass the section's `block`: when the section is the first on its page, its
 * headline is the page's <h1>; everywhere else it is an <h2>. Same look.
 */
export function sectionNumber(block) {
  const blocks = block?.page?.bodyBlocks || []
  const i = blocks.indexOf(block)
  return i < 0 ? null : String(i + 1).padStart(2, '0')
}

export function Eyebrow({ block, children, className }) {
  const no = sectionNumber(block)
  return (
    <span className={cn('eyebrow', className)}>
      {no && <span className="eyebrow-no" aria-hidden="true">No.&thinsp;{no}</span>}
      <span className="eyebrow-label">{children}</span>
    </span>
  )
}

export default function Shout({ pretitle, title, block, align = 'left', size = 'lg', className, children }) {
  const Heading = block && block.page?.bodyBlocks?.[0] === block ? H1 : H2
  const center = align === 'center'
  const sizes = {
    lg: 'text-[clamp(2.5rem,5.6vw,4.75rem)]',
    md: 'text-[clamp(2.25rem,4.4vw,3.5rem)]',
  }
  return (
    <div className={cn(center ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl', className)}>
      {pretitle ? <Eyebrow block={block} className="mb-6">{pretitle}</Eyebrow> : null}
      {title ? (
        <Heading
          text={title}
          /* Size before leading: tailwind-merge drops a line-height that comes before a font size. */
          className={cn('font-display text-heading font-medium tracking-[-0.02em]', sizes[size] || sizes.lg, 'leading-[0.98]')}
        />
      ) : null}
      {children}
    </div>
  )
}
