import { useState, useCallback, useEffect, useRef } from 'react'
import { P, Icon, Overlay, cn, useWebsite, applyBasePath } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import useRow from '#components/useRow.js'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The clip shape (`aspect`): the tile, how many tiles fill a row, and the
 * player's frame. Vertical is for reels and shorts, landscape for ordinary
 * YouTube or Vimeo videos.
 */
const SHAPES = {
  vertical: {
    tile: 'aspect-[9/16]',
    slot: 'w-[62%] xs:w-[40%] md:w-[28%] lg:w-[calc((100%-4*1.25rem)/5)]',
    frame: 'aspect-[9/16] h-[min(72vh,calc((100vw-9rem)*16/9))]',
    dialog: 'max-w-3xl',
  },
  square: {
    tile: 'aspect-square',
    slot: 'w-[72%] xs:w-[46%] md:w-[31%] lg:w-[calc((100%-3*1.25rem)/4)]',
    frame: 'aspect-square h-[min(72vh,calc(100vw-9rem))]',
    dialog: 'max-w-3xl',
  },
  landscape: {
    tile: 'aspect-video',
    slot: 'w-[85%] sm:w-[60%] md:w-[45%] lg:w-[calc((100%-2*1.25rem)/3)]',
    frame: 'aspect-video w-full',
    dialog: 'max-w-5xl',
  },
}

/**
 * Where a clip comes from. A YouTube or Vimeo link plays in that site's
 * player; anything else is a video file the browser plays itself.
 */
function sourceOf(src = '') {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) {
    return {
      embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&playsinline=1`,
      thumb: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
    }
  }
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { embed: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`, thumb: '' }
  return { embed: '', thumb: '' }
}

/** The clips: one per `###` item, each its title, `####` tag and first video. */
function clipsOf(items, basePath) {
  return items
    .map((item) => {
      const video = item.videos?.[0]
      if (!video?.src) return null
      const src = /^https?:/.test(video.src) ? video.src : applyBasePath(video.src, basePath)
      const { embed, thumb } = sourceOf(src)
      const poster = video.poster ? applyBasePath(video.poster, basePath) : thumb
      return { title: item.title, tag: item.subtitle, caption: video.alt, src, embed, poster }
    })
    .filter(Boolean)
}

/**
 * One clip on the shelf: a 9:16 tile that plays silently while it is hovered
 * or focused, numbered as a reel, its title on a band at the foot. Pressing
 * it opens the player, with sound.
 */
function Reel({ clip, index, onOpen, badge, shape }) {
  const videoRef = useRef(null)
  const play = () => {
    const v = videoRef.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.play().catch(() => {})
  }
  const stop = () => videoRef.current?.pause()

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      aria-label={`Play video: ${clip.title}`}
      aria-haspopup="dialog"
      className={cn('group relative block w-full overflow-hidden bg-muted text-left', shape.tile)}
    >
      {clip.embed ? (
        clip.poster && <img src={clip.poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          // `#t=0.1` makes Safari draw the first frame when there's no poster.
          src={clip.poster ? clip.src : `${clip.src}#t=0.1`}
          poster={clip.poster || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      )}
      {badge && <span className="caps absolute left-3 top-3 bg-paper px-2 py-1 text-[0.5625rem] text-ink">{badge} {pad(index + 1)}</span>}
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-brand text-paper transition-transform duration-300 group-hover:scale-110"
      >
        <Icon name="lu-play" size="16" className="translate-x-px" />
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--ink)] via-[color-mix(in_srgb,var(--ink)_60%,transparent)] to-transparent px-4 pb-4 pt-16">
        {clip.tag && <span className="caps block text-[0.5625rem] text-[var(--brand-bright)]">{clip.tag}</span>}
        <span className="font-display mt-1.5 block text-xl italic leading-tight text-paper">{clip.title}</span>
      </span>
    </button>
  )
}

/** The player: one clip at a time, with sound, paging with the arrows and arrow keys. */
function Player({ clips, index, onClose, onStep, shape, closeLabel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStep])

  const clip = clips[index]
  const arrow = 'grid size-12 shrink-0 place-items-center border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink'

  return (
    <Overlay onClose={onClose} className="items-center justify-center bg-ink/95 p-4 sm:p-8">
      <div role="dialog" aria-modal="true" aria-label={clip.title} className={cn('flex w-full flex-col items-center', shape.dialog)}>
        <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous video" className={cn(arrow, clips.length < 2 && 'invisible')}>
            <Icon name="lu-arrow-left" size="20" />
          </button>
          <div className={cn('bg-black', shape.frame)}>
            {clip.embed ? (
              <iframe
                key={clip.src}
                src={clip.embed}
                title={clip.title}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                className="size-full"
              />
            ) : (
              <video key={clip.src} src={clip.src} poster={clip.poster || undefined} controls autoPlay playsInline className="size-full object-contain" />
            )}
          </div>
          <button type="button" onClick={() => onStep(1)} aria-label="Next video" className={cn(arrow, clips.length < 2 && 'invisible')}>
            <Icon name="lu-arrow-right" size="20" />
          </button>
        </div>

        <div className="mt-6 max-w-xl text-center">
          <p className="font-display text-xl italic text-paper sm:text-2xl">{clip.caption || clip.title}</p>
          <p className="caps mt-3 text-[0.625rem] text-[var(--brand-bright)]">
            {clip.tag ? `${clip.tag} · ` : ''}{pad(index + 1)} / {pad(clips.length)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="caps mt-6 border border-paper/40 px-5 py-3 text-[0.625rem] text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          {closeLabel}
        </button>
      </div>
    </Overlay>
  )
}

/**
 * A shelf of short vertical videos — reels — in one row that scrolls
 * sideways, with arrows beside the heading. Each clip plays silently on hover
 * and opens in a player with sound. The clips are the section's items: a
 * `###` title, a `####` tag, and a video — a file, or a YouTube or Vimeo link.
 */
export default function VideoShelf({ content, params, block }) {
  const { website } = useWebsite()
  const { pretitle, title, paragraphs, items } = content
  const links = buttonLinks(content)
  const { aspect = 'vertical', badgeLabel = 'Reel', closeLabel = 'Close', tone = '' } = params
  const shape = SHAPES[aspect] || SHAPES.vertical
  const clips = clipsOf(items, website.basePath)

  const trackRef = useRef(null)
  const row = useRow(trackRef, clips.length)
  const [index, setIndex] = useState(null)
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? null : (i + delta + clips.length) % clips.length)),
    [clips.length]
  )

  const arrow = 'grid size-12 place-items-center border border-heading text-heading transition-colors hover:bg-heading hover:text-section disabled:pointer-events-none disabled:opacity-30'

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          {(pretitle || title) && (
            <Shout pretitle={pretitle} title={title} block={block} size="md">
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
              ))}
            </Shout>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {links.map((l, i) => (
              <Button key={i} {...linkProps(l)} tone="outline">
                {l.label} <Icon name="lu-arrow-right" size="15" />
              </Button>
            ))}
            {clips.length > 1 && (
              <>
                <button type="button" onClick={() => row.move(-1)} disabled={row.start} aria-label="Previous videos" className={cn(arrow, links.length > 0 && 'ml-3')}>
                  <Icon name="lu-arrow-left" size="18" />
                </button>
                <button type="button" onClick={() => row.move(1)} disabled={row.end} aria-label="Next videos" className={arrow}>
                  <Icon name="lu-arrow-right" size="18" />
                </button>
              </>
            )}
          </div>
        </div>

        <ul
          ref={trackRef}
          aria-label={title ? undefined : 'Videos'}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain"
        >
          {clips.map((clip, i) => (
            <li key={clip.src} className={cn('shrink-0 snap-start', shape.slot)}>
              <Reel clip={clip} index={i} onOpen={() => setIndex(i)} badge={badgeLabel} shape={shape} />
            </li>
          ))}
        </ul>

        {index !== null && clips[index] && <Player clips={clips} index={index} onClose={close} onStep={step} shape={shape} closeLabel={closeLabel} />}
      </div>
    </div>
  )
}
