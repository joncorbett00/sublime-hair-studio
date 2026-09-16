import { cn } from '@uniweb/kit'

/**
 * The house wordmark, set in type: "sublime" in Bodoni Moda italic, and
 * "hair studio" as a line of wide capitals beneath it. Sized by font-size —
 * pass a text-* class and the whole mark scales with it.
 */
export default function Wordmark({ tagline = 'hair studio', className }) {
  return (
    <span className={cn('inline-flex flex-col items-center whitespace-nowrap [line-height:1]', className)}>
      <span className="font-display font-medium italic tracking-[-0.03em] text-heading">sublime</span>
      <span
        className="mt-[0.3em] mr-[-0.34em] text-[0.24em] font-semibold uppercase tracking-[0.34em] text-heading [font-stretch:125%]"
      >
        {tagline}
      </span>
    </span>
  )
}
