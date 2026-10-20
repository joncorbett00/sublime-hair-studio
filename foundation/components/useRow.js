import { useState, useCallback, useEffect } from 'react'

/**
 * Previous / next for a sideways-scrolling row (the gallery carousel, the
 * video shelf). Each press moves one tile; a button is disabled at its end
 * of the row.
 */
export default function useRow(trackRef, count) {
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
  }, [trackRef])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [trackRef, measure, count])

  const move = useCallback((dir) => {
    const el = trackRef.current
    const item = el?.firstElementChild
    if (!item) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' })
  }, [trackRef])

  return { ...edges, move }
}
