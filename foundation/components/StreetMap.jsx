import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@uniweb/kit'
import { useInkCentre } from '#components/Seal.jsx'

// Positron, served by OpenFreeMap: free, no key, no cap — and a vector style
// whose layers hold no shops, bus stops, parking signs or house numbers, so
// the map is quiet by construction rather than by filtering a busy picture.
const STYLE = 'https://tiles.openfreemap.org/styles/positron'

/**
 * A token from the page as `rgb(r,g,b)`. MapLibre reads hex, rgb and hsl but
 * not every colour CSS can hold (oklch, color-mix…), so let a canvas resolve
 * whatever the site set and read the pixel back.
 */
function tokenColour(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
  if (!raw) return fallback
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = fallback
  ctx.fillStyle = raw
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}
const rgb = ([r, g, b], a = 1) => (a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`)
const mix = (x, y, t) => x.map((v, i) => Math.round(v + (y[i] - v) * t))

/**
 * The map's colours, from the site's own tokens. Each takes the ground the
 * streets are laid on and mixes the rest from it:
 *
 *   sand  a shade under the page — the map reads as an inset on the paper,
 *         not a hole in it; streets in paper, names in a softened ink
 *   ink   the dark block — streets in warm greys, names in a softened paper
 */
function palette(tone) {
  const ink = tokenColour('ink', '#17120F')
  const paper = tokenColour('paper', '#F6F0E6')
  const sand = tokenColour('sand', '#E6DBCB')
  if (tone === 'ink') {
    const t = (n) => rgb(mix(ink, paper, n))
    return {
      ground: t(0), residential: t(0.025), park: t(0.06), water: t(0.13),
      building: t(0.06), buildingEdge: t(0.1),
      path: t(0.12), minor: t(0.17), major: t(0.26), motorway: t(0.3), casing: t(0), subtle: t(0.2),
      street: t(0.62), place: t(0.78), halo: t(0),
    }
  }
  const d = (n) => rgb(mix(sand, ink, n))
  const l = (n) => rgb(mix(sand, paper, n))
  return {
    ground: d(0), residential: d(0.015), park: d(0.045), water: d(0.11),
    building: d(0.045), buildingEdge: d(0.09),
    path: l(0.45), minor: l(0.75), major: l(1), motorway: l(1), casing: d(0.07), subtle: l(0.6),
    street: d(0.58), place: d(0.72), halo: d(0),
  }
}

/**
 * Positron, recoloured: names in small spaced capitals like the rest of the
 * site's labels, and the layers that only add noise at a block's scale —
 * railways, airports, highway shields, boundaries — switched off.
 */
async function toneStyle(tone) {
  const style = await fetch(STYLE).then((r) => r.json())
  const c = palette(tone)
  const hide = /^(railway|aeroway|airport|boundary|highway-shield|road_shield|landcover_(ice|glacier)|tunnel_)/
  const paint = {
    background: { 'background-color': c.ground },
    landuse_residential: { 'fill-color': c.residential },
    park: { 'fill-color': c.park },
    landcover_wood: { 'fill-color': c.park },
    water: { 'fill-color': c.water },
    waterway: { 'line-color': c.water },
    building: { 'fill-color': c.building, 'fill-outline-color': c.buildingEdge },
    road_area_pier: { 'fill-color': c.ground },
    road_pier: { 'line-color': c.ground },
    highway_path: { 'line-color': c.path },
    highway_minor: { 'line-color': c.minor },
    highway_major_casing: { 'line-color': c.casing },
    highway_major_inner: { 'line-color': c.major },
    highway_major_subtle: { 'line-color': c.subtle },
    highway_motorway_casing: { 'line-color': c.casing },
    highway_motorway_inner: { 'line-color': c.motorway },
    highway_motorway_subtle: { 'line-color': c.subtle },
    highway_motorway_bridge_casing: { 'line-color': c.casing },
    highway_motorway_bridge_inner: { 'line-color': c.motorway },
  }
  style.layers = style.layers
    .filter((l) => !hide.test(l.id))
    .map((l) => {
      if (paint[l.id]) return { ...l, paint: { ...l.paint, ...paint[l.id] } }
      if (l.type !== 'symbol') return l
      const street = l.id.startsWith('highway-name')
      return {
        ...l,
        layout: street
          ? { ...l.layout, 'text-transform': 'uppercase', 'text-letter-spacing': 0.14, 'text-size': 9.5 }
          : l.layout,
        paint: {
          ...l.paint,
          'text-color': street ? c.street : c.place,
          'text-halo-color': c.halo,
          'text-halo-width': 1.2,
          'text-halo-blur': 0,
        },
      }
    })
  return style
}

/**
 * The map's pin: the turning seal pared down to a brand disc, a hairline ring
 * and the initial — the same mark as the hero, small enough to sit on a street.
 */
function SealPin({ letter }) {
  const ref = useRef(null)
  const inkCentre = useInkCentre(ref, letter)
  return (
    <div className="map-pin grid size-12 place-items-center rounded-full bg-brand">
      <span className="absolute inset-[4px] rounded-full border border-paper/45" />
      <span
        ref={ref}
        style={inkCentre ? { transform: inkCentre } : undefined}
        className="font-logo text-2xl font-medium italic leading-none text-[var(--seal-letter)]"
      >
        {letter}
      </span>
    </div>
  )
}

/**
 * A still map of one block, with the seal on the address. The whole map is
 * the directions link: nobody plans a route in a box on a web page, they press
 * it so the app that knows where they are can take over. So the map doesn't
 * pan or zoom — a map that drags under a link is a press that sometimes
 * navigates and sometimes doesn't.
 *
 * MapLibre touches `window` as it loads, so it is imported inside the effect
 * and never reaches the prerender. Until it has drawn — and if it never
 * does — the box holds the address in words.
 */
export default function StreetMap({ lat, lng, zoom = 16, tone = 'sand', letter = '', href = '', label = '', fallback = '', className }) {
  const host = useRef(null)
  const [pinEl, setPinEl] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!host.current) return
    let map = null
    let live = true
    const pin = document.createElement('div')
    setPinEl(pin)

    ;(async () => {
      const [mod, style] = await Promise.all([import('maplibre-gl'), toneStyle(tone).catch(() => STYLE)])
      const maplibre = mod.default ?? mod
      if (!live || !host.current) return
      map = new maplibre.Map({
        container: host.current,
        style,
        center: [lng, lat],
        zoom,
        attributionControl: false,
        interactive: false,
      })
      // The data's licence asks for the credit; the style already carries it.
      map.addControl(new maplibre.AttributionControl({ compact: false }), 'bottom-left')
      new maplibre.Marker({ element: pin, anchor: 'center' }).setLngLat([lng, lat]).addTo(map)
      map.on('load', () => live && setReady(true))
    })()

    return () => {
      live = false
      map?.remove()
    }
  }, [lat, lng, zoom, tone])

  return (
    <div data-tone={tone} className={cn('relative overflow-hidden', tone === 'ink' ? 'bg-ink' : 'bg-sand', className)}>
      <div ref={host} className="street-map" />

      {!ready && fallback && (
        <p className={cn('font-display absolute inset-0 flex items-center justify-center whitespace-pre-line px-8 text-center text-lg italic', tone === 'ink' ? 'text-paper/60' : 'text-ink/55')}>
          {fallback}
        </p>
      )}

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label || undefined}
          className="absolute inset-0 z-[2] transition-colors hover:bg-ink/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
          <span className="sr-only">{label}</span>
        </a>
      )}

      {pinEl && ready && createPortal(<SealPin letter={letter} />, pinEl)}
    </div>
  )
}
