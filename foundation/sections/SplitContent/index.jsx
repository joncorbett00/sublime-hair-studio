import { P, Icon, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

const iconName = (item) => (item.icons?.[0] ? `${item.icons[0].library}-${item.icons[0].name}` : 'lu-check')

/**
 * Image beside prose. The general-purpose workhorse — about pages, the
 * story, policies. The photo sits in a paper mat — square, an arched window
 * or a film gate (`frame`) — with a second hairline round the mount, and a
 * caption like a figure ("Fig.", "Still" — `captionLabel`).
 * The `###` items become a numbered, ruled list.
 */
export default function SplitContent({ content, params, block }) {
  const { pretitle, title, paragraphs, images, items } = content
  const links = buttonLinks(content)
  const { flipped = false, frame = 'rounded', captionLabel = 'Fig.', tone = '' } = params
  const image = images[0]
  const shape = frame === 'arch' || frame === 'gate' ? frame : ''

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className={cn('grid items-center gap-16 lg:grid-cols-2 lg:gap-24', flipped && 'lg:[&>*:first-child]:order-2')}>
          <div>
            <Shout pretitle={pretitle} title={title} block={block} size="md">
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
              ))}
            </Shout>

            {links.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {links.map((l, i) => (
                  <Button key={i} {...linkProps(l)} tone={i === 0 ? 'primary' : 'outline'}>{l.label}</Button>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <ol className="mt-14 grid gap-x-10 sm:grid-cols-2">
                {items.map((item, i) => (
                  <li key={i} className="border-t border-heading/25 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display text-sm italic text-accent-ink" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon name={iconName(item)} size="16" className="text-subtle" />
                    </div>
                    <strong className="font-display mt-3 block text-xl font-medium leading-snug text-heading">{item.title}</strong>
                    {item.paragraphs.map((p, j) => (
                      <P key={j} text={p} className="mt-1.5 text-[0.9375rem] leading-relaxed text-body" />
                    ))}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {image && (
            <figure className={cn('relative mx-auto w-full max-w-md lg:max-w-[30rem]', flipped ? 'lg:mr-auto lg:ml-4' : 'lg:ml-auto lg:mr-4')}>
              <div className={cn('mat', shape)}>
                <span aria-hidden="true" className="halo" />
                <img
                  src={image.url || image.src}
                  alt={image.alt || ''}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
              {image.alt && (
                <figcaption className={cn('figcap mt-8', flipped ? 'text-right' : 'text-left')}>
                  {captionLabel && <><b>{captionLabel}</b>&ensp;</>}{image.alt}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </div>
  )
}
