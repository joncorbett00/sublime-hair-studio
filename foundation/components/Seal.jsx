import { cn } from '@uniweb/kit'

/**
 * The turning seal: a vermilion disc with a line of wide capitals running round
 * its edge and the Bodoni "S" in the middle. The words are decoration — they
 * also appear in the page's own copy — so the whole thing is aria-hidden.
 */
export default function Seal({ text, className }) {
  // Short phrases go round twice so the ring never looks sparse.
  const ring = (text.length < 20 ? `${text} ✦ ${text} ✦ ` : `${text} ✦ `)
  const id = `seal-${text.length}-${text.charCodeAt(0)}`
  return (
    <div
      aria-hidden="true"
      className={cn('relative grid size-28 place-items-center rounded-full bg-vermilion text-paper sm:size-36', className)}
    >
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full">
        <defs>
          <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-current text-[8.5px] font-semibold uppercase [font-stretch:125%]">
          <textPath href={`#${id}`} textLength="272">{ring}</textPath>
        </text>
      </svg>
      <span className="size-[58%] rounded-full border border-paper/45" />
      <span className="font-display absolute text-4xl font-medium italic leading-none sm:text-5xl">S</span>
    </div>
  )
}
