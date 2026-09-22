import { P, Icon, Link, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'
import { buttonLinks, linkProps } from '#utils/links.js'

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
 * The map is an embedded OpenStreetMap frame — no API key, no tracking script.
 */
export default function Visit({ content, params, block }) {
  const { pretitle, title, paragraphs, items } = content
  const links = buttonLinks(content)
  const hours = content.data?.hours || []
  const {
    address = '',
    phone = '',
    phoneHref = '',
    email = '',
    mapEmbed = '',
    mapLink = '',
    mapTitle = 'Map to the studio',
    hoursNote = '',
    tone = '',
  } = params

  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long' })

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <Shout pretitle={pretitle} title={title} block={block}>
              {paragraphs.map((p, i) => (
                <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
              ))}
            </Shout>

            <div className="mt-12 border-b border-heading/25">
              <Detail label="Where">
                <address className="font-display whitespace-pre-line text-2xl not-italic leading-snug text-heading">{address}</address>
                {mapLink && (
                  <Link href={mapLink} className="text-cta mt-4">
                    Get directions <Icon name="lu-arrow-up-right" size="13" />
                  </Link>
                )}
              </Detail>

              {hours.length > 0 && (
                <Detail label="When">
                  <dl className="max-w-xs">
                    {hours.map((row, i) => {
                      const isToday = row.day === today
                      const closed = /closed/i.test(row.open)
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex justify-between gap-4 px-2 py-1',
                            isToday && 'bg-brand font-semibold text-paper'
                          )}
                        >
                          <dt className={isToday ? 'text-paper' : 'text-body'}>
                            {row.day}{isToday && <span className="caps ml-2 text-[0.5rem]">Today</span>}
                          </dt>
                          <dd className={isToday ? 'text-paper' : closed ? 'text-subtle' : 'text-heading'}>{row.open}</dd>
                        </div>
                      )
                    })}
                  </dl>
                  {hoursNote && <p className="font-display mt-4 italic text-subtle">{hoursNote}</p>}
                </Detail>
              )}

              {(phone || email) && (
                <Detail label="Reach us">
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
            {mapEmbed && (
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
