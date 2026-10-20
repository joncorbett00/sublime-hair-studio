import { useEffect, useRef, useState } from 'react'
import { cn } from '@uniweb/kit'

/**
 * The turning seal: a brand-colour disc with a line of wide capitals running
 * round its edge and an initial in the logo face (`font-logo`) in the middle. The words are decoration —
 * they also appear in the page's own copy — so the whole thing is aria-hidden.
 *
 *   ring  a hairline ring round the initial (Sublime)
 *   reel  a film reel's hub: a hairline and six holes round the centre (Bijou)
 *
 * The initial is drawn in the `seal-letter` var.
 */
// Advance widths of the ring's capitals, in em, measured in the label face.
// Anything unlisted counts as an average capital. It only has to be close:
// `textLength` absorbs the rest by nudging the letter-spacing.
const NARROW = { I: 0.28, ' ': 0.2, '.': 0.3, ',': 0.3, '·': 0.33, '-': 0.33, "'": 0.25, '’': 0.28, '!': 0.29, '/': 0.3, ':': 0.3 }
const WIDE = { M: 0.84, W: 0.95 }
const DIGIT = 0.58
const CAPITAL = 0.7
const emWidth = (s) =>
  [...s.toUpperCase()].reduce((w, c) => w + (NARROW[c] ?? WIDE[c] ?? (c >= '0' && c <= '9' ? DIGIT : CAPITAL)), 0)

const CIRCUMFERENCE = 2 * Math.PI * 42 // the text path's radius, in viewBox units
const IDEAL = 11 // the type size the seal is drawn for
const MIN = 6.5
const MAX = 13
const GAP = 1.6 // the empty space between laps, in em

/**
 * How the phrase goes round: repeated as often as keeps the type nearest its
 * ideal size with its natural letter-spacing, then sized so the laps close the
 * circle. A short phrase goes round three or four times at a normal size
 * instead of being stretched thin; a long one goes round once instead of
 * being squashed. Past the size limits, `textLength` makes up the difference
 * with the letter-spacing, which reads worse than a size change — so that
 * counts double against a choice.
 *
 * Each lap is its own run of text, set into an equal share of the circle with
 * a fixed gap at its end, so the space between repeats is exact rather than
 * whatever a run of spaces happens to come to.
 */
function fitRing(text) {
  const unit = emWidth(text) + GAP
  let best = null
  for (let repeats = 1; repeats <= 6; repeats++) {
    const exact = CIRCUMFERENCE / (repeats * unit)
    const size = Math.min(MAX, Math.max(MIN, exact))
    const miss = Math.abs(Math.log(size / IDEAL)) + 2 * Math.abs(Math.log(exact / size))
    if (!best || miss < best.miss) best = { repeats, size, exact, miss }
  }
  const { repeats, size, exact } = best
  const share = CIRCUMFERENCE / repeats
  const gap = size * GAP
  return {
    size: +size.toFixed(2),
    laps: Array.from({ length: repeats }, (_, i) => +(i * share + gap / 2).toFixed(1)),
    length: +(share - gap).toFixed(1),
    // A phrase too long to fit even once at the smallest size has its letters narrowed too.
    squeeze: exact < MIN * 0.92,
  }
}

/**
 * Where a glyph's ink sits, from its origin on the baseline: halfway between
 * the middle of its outline and the centre of its weight. The outline alone
 * isn't what the eye centres — an italic S carries more ink in its upper
 * right — and the weight alone overcorrects, so letters are centred by eye
 * somewhere between the two.
 */
function inkCentreOf(letter, font, em) {
  const pad = Math.ceil(em)
  const size = Math.ceil(em * 3)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.font = font
  const m = ctx.measureText(letter)
  ctx.fillText(letter, pad, pad * 2)
  const { data } = ctx.getImageData(0, 0, size, size)
  let mass = 0, mx = 0, my = 0
  for (let i = 3; i < data.length; i += 4) {
    if (!data[i]) continue
    const p = (i - 3) / 4
    mass += data[i]
    mx += (p % size) * data[i]
    my += Math.floor(p / size) * data[i]
  }
  const boxX = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2
  const boxY = (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2
  const weightX = mass ? mx / mass + 0.5 - pad : boxX
  const weightY = mass ? my / mass + 0.5 - pad * 2 : boxY
  return {
    x: (boxX + weightX) / 2,
    y: (boxY + weightY) / 2,
    width: m.width,
    ascent: m.fontBoundingBoxAscent,
    descent: m.fontBoundingBoxDescent,
  }
}

/**
 * The initial is centred on its ink, not its type box. A letter's box is set
 * by the face's metrics, and an italic's overhang or a face's tall ascender
 * leaves the visible glyph off the middle of it — so measure the glyph once
 * its face has loaded and nudge it back, in em so the nudge holds at every
 * size the letter is drawn at.
 */
export function useInkCentre(ref, letter) {
  const [offset, setOffset] = useState(null)
  useEffect(() => {
    let live = true
    const el = ref.current
    if (!el || !letter) return
    const cs = getComputedStyle(el)
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const measure = () => {
      if (!live || !ref.current) return
      const em = parseFloat(cs.fontSize)
      const ink = inkCentreOf(letter, font, em)
      // Against the middle of the advance across, and the middle of the line
      // box down, with the baseline where CSS puts it (half-leading either side).
      const line = ref.current.offsetHeight
      const baseline = (line - ink.ascent - ink.descent) / 2 + ink.ascent
      const x = ink.width / 2 - ink.x
      const y = line / 2 - (baseline + ink.y)
      setOffset(`translate(${(x / em).toFixed(3)}em, ${(y / em).toFixed(3)}em)`)
    }
    // Measure now, and again whenever a face finishes loading. Waiting for
    // this one face isn't enough: when the site's font rules arrive after the
    // seal mounts, there is nothing yet to wait for, and the fallback serif
    // gets measured instead of the logo face.
    document.fonts.load(font, letter).catch(() => {}).then(measure)
    document.fonts.addEventListener('loadingdone', measure)
    return () => {
      live = false
      document.fonts.removeEventListener('loadingdone', measure)
    }
  }, [ref, letter])
  return offset
}

export default function Seal({ text, letter = '', style = 'ring', className }) {
  const { size, laps, length, squeeze } = fitRing(text)
  const letterRef = useRef(null)
  const inkCentre = useInkCentre(letterRef, letter)
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
      className={cn('relative grid size-28 place-items-center overflow-hidden rounded-full bg-brand text-paper sm:size-40', className)}
    >
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full">
        <defs>
          <path id={id} d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
        </defs>
        <text className="fill-current font-semibold uppercase [font-stretch:var(--label-stretch)]" fontSize={size}>
          {laps.map((start, i) => (
            <textPath key={i} href={`#${id}`} startOffset={start} textLength={length} lengthAdjust={squeeze ? 'spacingAndGlyphs' : 'spacing'}>
              {text}
            </textPath>
          ))}
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
      {!reel && <span className="size-[52%] rounded-full border border-paper/45" />}
      <span
        ref={letterRef}
        style={inkCentre ? { transform: inkCentre } : undefined}
        className="font-logo absolute text-4xl font-medium italic leading-none text-[var(--seal-letter)] sm:text-5xl"
      >
        {letter}
      </span>
    </div>
  )
}
