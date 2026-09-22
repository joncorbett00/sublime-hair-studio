import { cn } from '@uniweb/kit'

/**
 * The turning seal: a brand-colour disc with a line of wide capitals running
 * round its edge and a Bodoni initial in the middle. The words are decoration —
 * they also appear in the page's own copy — so the whole thing is aria-hidden.
 *
 *   ring  a hairline ring round the initial (Sublime)
 *   reel  a film reel's hub: a hairline and six holes round the centre (Bijou)
 *
 * The initial is drawn in the `seal-letter` var.
 */
export default function Seal({ text, letter = '', style = 'ring', className }) {
  // Short phrases go round twice so the ring never looks sparse.
  const ring = (text.length < 20 ? `${text} ✦ ${text} ✦ ` : `${text} ✦ `)
  const id = `seal-${text.length}-${text.charCodeAt(0)}`
  const reel = style === 'reel'
  const holes = reel
    ? Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3 - Math.PI / 2
        return { cx: +(60 + Math.cos(a) * 25).toFixed(2), cy: +(60 + Math.sin(a) * 25).toFixed(2) }
      })
    : []
  return (
    <div
      aria-hidden="true"
      className={cn('relative grid size-28 place-items-center overflow-hidden rounded-full bg-brand text-paper sm:size-36', className)}
    >
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full">
        <defs>
          <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-current text-[8.5px] font-semibold uppercase [font-stretch:125%]">
          <textPath href={`#${id}`} textLength="272">{ring}</textPath>
        </text>
        {reel && (
          <>
            <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.75" />
            {holes.map((h, i) => (
              <circle key={i} cx={h.cx} cy={h.cy} r="3.2" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.75" />
            ))}
          </>
        )}
      </svg>
      {!reel && <span className="size-[58%] rounded-full border border-paper/45" />}
      <span className="font-logo absolute text-4xl font-medium italic leading-none text-[var(--seal-letter)] sm:text-5xl">{letter}</span>
    </div>
  )
}
