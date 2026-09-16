import { useEffect } from 'react'
import { Overlay, Icon } from '@uniweb/kit'

/**
 * Full-screen photo viewer with arrow-key paging. Overlay owns Escape, focus
 * containment and the scroll lock.
 *
 * Shared by the photo wall and the service menu's per-service photo strips, so
 * paging a service's results and paging the wall feel like the same thing.
 * `subtitle` is whatever the caller wants in front of the "03 / 08" counter.
 */
export default function Lightbox({ shots, index, onClose, onStep, subtitle }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onStep])

  const shot = index === null ? null : shots[index]
  if (!shot) return null

  const pad = (n) => String(n).padStart(2, '0')
  const arrow = 'absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-ink bg-paper text-ink transition-colors hover:bg-vermilion hover:text-paper'

  return (
    <Overlay onClose={onClose} className="items-center bg-ink/95 p-4 sm:p-8">
      <div role="dialog" aria-modal="true" aria-label={shot.title} className="flex w-full max-w-5xl flex-col items-center">
        <div className="relative w-full">
          <img
            src={shot.image}
            alt={shot.title || ''}
            className="mx-auto max-h-[72vh] w-auto object-contain"
          />
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={`${arrow} left-2`}>
            <Icon name="lu-arrow-left" size="20" />
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={`${arrow} right-2`}>
            <Icon name="lu-arrow-right" size="20" />
          </button>
        </div>

        <div className="mt-8 max-w-2xl text-center">
          <p className="font-display text-xl italic text-paper sm:text-2xl">{shot.caption || shot.title}</p>
          <p className="caps mt-3 text-[0.625rem] text-[var(--vermilion-bright)]">
            {subtitle ? `${subtitle} · ` : ''}{pad(index + 1)} / {pad(shots.length)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="caps mt-6 border border-paper/40 px-5 py-3 text-[0.625rem] text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          Close
        </button>
      </div>
    </Overlay>
  )
}
