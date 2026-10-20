import { P, Span, Text, Icon, Link, cn, useWebsite } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import StreetMap from '#components/StreetMap.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'
import { initialOf, wordmarkParts } from '#utils/wordmark.js'
import { entries } from '#utils/entries.js'

const iconName = (item, fallback) =>
  item.icons?.[0] ? `${item.icons[0].library}-${item.icons[0].name}` : fallback

/** One ruled row of the details column: a label in wide capitals, then the facts. */
function Detail({ label, children }) {
  return (
    <div className="grid gap-2 border-t border-heading/25 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
      <h3 className="caps pt-1 text-[0.625rem] text-heading">{label}</h3>
      <div>{children}</div>
    </div>
  )
}

/**
 * Address, hours and the practical details. Heading and ruled detail rows on
 * one side; on the other, the map in a hairline frame and the buttons
 * under it (booking, directions). Practical notes run beneath as a numbered index.
 *
 * With `lat` and `lng`, the map is a quiet street map (no shops, stops or
 * house numbers) with the seal's initial as its pin, and the whole map opens
 * the directions link. Without them, `mapEmbed` puts an embedded map frame
 * there instead.
 */
export default function Visit({ content, params, block }) {
  const { website } = useWebsite()
  const { pretitle, title, paragraphs, items } = content
  const links = buttonLinks(content)
  const hours = entries(content.data?.hours)
  const {
    address = '',
    phone = '',
    phoneHref = '',
    email = '',
    lat = '',
    lng = '',
    zoom = 16,
    mapTone = 'sand',
    pinLetter = '',
    mapEmbed = '',
    mapLink = '',
    mapTitle = 'Map to the studio',
    hoursNote = '',
    flipped = false,
    whereLabel = 'Where',
    whenLabel = 'When',
    contactLabel = 'Reach us',
    directionsLabel = 'Get directions',
    todayLabel = 'Today',
    tone = '',
  } = params

  const located = lat !== '' && lng !== '' && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
  const directions = mapLink || (located ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '')
  const letter = pinLetter || initialOf(wordmarkParts(website.name).name)

  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long' })

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className={cn('grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24', flipped && 'lg:[&>*:first-child]:order-2')}>
          <div>
            <Shout pretitle={pretitle} title={title} block={block}>
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
              ))}
            </Shout>

            <div className="mt-12 border-b border-heading/25">
              <Detail label={whereLabel}>
                <address className="font-display whitespace-pre-line text-2xl not-italic leading-snug text-heading">{address}</address>
                {directions && (
                  <Link href={directions} className="text-cta mt-4">
                    {directionsLabel} <Icon name="lu-arrow-up-right" size="13" />
                  </Link>
                )}
              </Detail>

              {hours.length > 0 && (
                <Detail label={whenLabel}>
                  <dl className="max-w-xs">
                    {hours.map((row, i) => {
                      const isToday = row.title === today
                      const closed = /closed/i.test(row.text)
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex justify-between gap-4 px-2 py-1',
                            isToday && 'bg-brand font-semibold text-paper'
                          )}
                        >
                          <dt className={isToday ? 'text-paper' : 'text-body'}>
                            <Span text={row.title} />{isToday && todayLabel && <span className="caps ml-2 text-[0.5rem]">{todayLabel}</span>}
                          </dt>
                          <Text as="dd" text={row.text} className={isToday ? 'text-paper' : closed ? 'text-subtle' : 'text-heading'} />
                        </div>
                      )
                    })}
                  </dl>
                  {hoursNote && <p className="font-display mt-4 italic text-subtle">{hoursNote}</p>}
                </Detail>
              )}

              {(phone || email) && (
                <Detail label={contactLabel}>
                  <ul className="space-y-1.5">
                    {phone && (
                      <li>
                        <Link href={phoneHref || `tel:${phone.replace(/[^\d+]/g, '')}`} className="font-display text-2xl text-heading transition-colors hover:text-accent-ink">{phone}</Link>
                      </li>
                    )}
                    {email && (
                      <li>
                        <Link href={`mailto:${email}`} className="text-body underline decoration-heading/30 underline-offset-4 transition-colors hover:text-accent-ink">{email}</Link>
                      </li>
                    )}
                  </ul>
                </Detail>
              )}
            </div>
          </div>

          <div className="lg:pt-24">
            {located ? (
              <div className="framed p-2.5">
                <StreetMap
                  lat={Number(lat)}
                  lng={Number(lng)}
                  zoom={Number(zoom) || 16}
                  tone={mapTone}
                  letter={letter}
                  href={directions}
                  label={`${directionsLabel} — ${mapTitle}`}
                  fallback={address}
                  className="aspect-[4/5]"
                />
              </div>
            ) : mapEmbed && (
              <div className="framed p-2.5">
                <iframe
                  title={mapTitle}
                  src={mapEmbed}
                  className="aspect-[4/5] w-full border-0 grayscale-[60%] sepia-[15%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            {links.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-4">
                {links.map((l, i) => (
                  <Button key={i} {...linkProps(l)} size="lg" tone={i === 0 ? 'primary' : 'outline'} className="flex-1">
                    {l.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <ul className="mt-24 grid border-t border-heading sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <li key={i} className="border-b border-heading/25 py-8 sm:pr-10 lg:[&:nth-child(3n+2)]:px-10 lg:[&:nth-child(3n)]:pl-10 lg:[&:nth-child(3n+2)]:border-x lg:[&:nth-child(3n+2)]:border-x-heading/25">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm italic text-accent-ink" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <Icon name={iconName(item, 'lu-info')} size="18" className="text-subtle" />
                </div>
                <h3 className="font-display mt-4 text-2xl font-medium text-heading">{item.title}</h3>
                {item.paragraphs.map((p, j) => (
                  <P key={j} text={p} className="mt-2 text-[0.9375rem] leading-relaxed text-body" />
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
