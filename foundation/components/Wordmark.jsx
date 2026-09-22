import { cn } from '@uniweb/kit'

/**
 * The house wordmark, set in type: the name in Bodoni Moda italic (the only
 * place that face is used, with the seal), and the tagline as a line of wide
 * capitals beneath it — "sublime / hair studio", "bijou / boutique". Sized by
 * font-size: pass a text-* class and the whole mark scales with it.
 *
 * Header and Footer take both words as settings; left empty, they come from
 * the site name (see utils/wordmark.js).
 */
export default function Wordmark({ name, tagline, className }) {
  return (
    <span className={cn('inline-flex flex-col items-center whitespace-nowrap [line-height:1]', className)}>
      <span className="font-logo font-medium italic tracking-[-0.03em] text-heading">{name}</span>
      {tagline && (
        <span
          className="mt-[0.3em] mr-[-0.34em] text-[0.24em] font-semibold uppercase tracking-[0.34em] text-heading [font-stretch:125%]"
        >
          {tagline}
        </span>
      )}
    </span>
  )
}
