import { useEffect, useState } from 'react'
import { Overlay, cn } from '@uniweb/kit'

/**
 * A small medallion pinned to the bottom-left corner of the page — a
 * brand-colour disc with a beaded edge, words running round its top and foot,
 * and a lighter gold ribbon across the middle that runs a little past the rim, the
 * way a commemorative seal is drawn. It doesn't turn: the hero's seal does,
 * and two turning seals on one page is one too many.
 *
 * It arrives a moment after the page, and a visitor can put it away; it stays
 * away for the rest of the visit (sessionStorage, when the browser allows it).
 * Rendered through kit's Overlay so it paints over every layout area.
 */
const KEY = 'sublime-badge-dismissed'

function dismissed() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

// Whole class names, so Tailwind finds them.
const WIDTHS = {
  small: 'w-[4.75rem] sm:w-[6rem]',
  medium: 'w-[5.75rem] sm:w-[7.5rem]',
  large: 'w-[7rem] sm:w-[9.5rem]',
}

export default function AnniversaryBadge({ title, top = '', bottom = '', size = 'medium', closeLabel = 'Hide' }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (dismissed()) return
    const t = setTimeout(() => setShown(true), 1200)
    return () => clearTimeout(t)
  }, [])

  if (!shown) return null

  const close = () => {
    setShown(false)
    try { sessionStorage.setItem(KEY, '1') } catch {}
  }
  const label = [top, title, bottom].filter(Boolean).join(' ')
  const beads = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * 2 * Math.PI
    return { cx: +(60 + Math.cos(a) * 55).toFixed(2), cy: +(60 + Math.sin(a) * 55).toFixed(2) }
  })

  return (
    <Overlay modal={false} className="items-end justify-start p-4 sm:p-6">
      <div className="badge-in group pointer-events-auto relative" role="note" aria-label={label}>
        <svg viewBox="-10 0 140 120" className={cn('h-auto drop-shadow-[0_6px_14px_rgb(0_0_0/0.22)]', WIDTHS[size] || WIDTHS.medium)} aria-hidden="true">
          <defs>
            {/* Clockwise over the top for the upper words; anticlockwise under
                the foot so the lower words read left to right, not upside down. */}
            <path id="badge-arc-top" d="M22,60 a38,38 0 0,1 76,0" />
            <path id="badge-arc-bottom" d="M17,60 a43,43 0 0,0 86,0" />
          </defs>

          <circle cx="60" cy="60" r="58" className="fill-[var(--brand)]" />
          {beads.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="1.25" className="fill-[var(--paper)]" fillOpacity="0.55" />
          ))}
          <circle cx="60" cy="60" r="50" fill="none" className="stroke-[var(--paper)]" strokeOpacity="0.5" strokeWidth="0.6" />

          <g className="fill-[var(--paper)] font-semibold uppercase [font-stretch:var(--label-stretch)]" fontSize="9.5" letterSpacing="1.4">
            {top && <text textAnchor="middle"><textPath href="#badge-arc-top" startOffset="50%">{top}</textPath></text>}
            {bottom && <text textAnchor="middle"><textPath href="#badge-arc-bottom" startOffset="50%">{bottom}</textPath></text>}
          </g>

          {/* The ribbon: a lighter cut of the brand colour with ink lettering,
              its ends notched, a touch wider than the disc — gold on gold, so
              it reads on paper and on ink alike. */}
          <path d="M-8,46 H128 L122,60 L128,74 H-8 L-2,60 Z" className="fill-[var(--brand-bright)]" />
          <path d="M-8,46.6 H128 M-8,73.4 H128" className="stroke-[var(--ink)]" strokeWidth="0.7" strokeOpacity="0.55" />
          <text
            x="60" y="60" textAnchor="middle" dominantBaseline="central"
            className="font-display fill-[var(--ink)] font-extrabold uppercase"
            fontSize="17" letterSpacing="0.5" textLength={title.length > 8 ? 108 : undefined} lengthAdjust="spacingAndGlyphs"
          >
            {title}
          </text>
        </svg>

        <button
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className={cn(
            'absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)] shadow',
            'opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100',
          )}
        >
          <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
            <path d="M2,2 L10,10 M10,2 L2,10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </Overlay>
  )
}
