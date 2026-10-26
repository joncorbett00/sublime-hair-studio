import { Link, H3, P, Text, cn, SocialIcon, filterSocialLinks, useWebsite, applyBasePath } from '@uniweb/kit'
import BusinessSchema from '#components/BusinessSchema.jsx'
import Wordmark from '#components/Wordmark.jsx'
import AnniversaryBadge from '#components/AnniversaryBadge.jsx'
import { wordmarkParts } from '#utils/wordmark.js'
import { toneClass } from '#components/tone.js'
import { linkProps } from '#utils/links.js'
import { entries } from '#utils/entries.js'
import { oneLine } from '#utils/text.js'
import { isClosed } from '#utils/locale.js'

const CREDIT_HREF = 'https://uniweb.studio'

/**
 * Footer, on ink. Blurb, socials, opening hours and the link columns across
 * the top; along the bottom the wordmark set as wide as the page, the way a
 * label signs off — or, with a `logo` image, the logo, centred. Takes the hours and columns as
 * authored markdown so the business can change them without anyone opening
 * this file. The edge along its top matches the masthead's.
 *
 * `tone` sets its colour (ink by default); `signature: false` drops the big
 * wordmark or logo at the foot. `badge` pins a small anniversary medallion
 * to the corner of every page.
 */
function Footer({ content, params }) {
  const { website } = useWebsite()
  const { title, paragraphs, links, lists, data } = content
  const social = filterSocialLinks(links)
  const plain = links.filter((l) => !social.includes(l))
  const hours = entries(data?.hours)
  const { credit = '', signoff = '', edge = 'selvedge', wordmark = '', logo = '', tone = 'ink', signature = true, hoursLabel = 'Hours', badge = '', badgeTop = '', badgeBottom = '', badgeSize = 'medium', badgeCloseLabel = 'Hide' } = params
  const mark = wordmarkParts(website.name, { wordmark })

  /* Each link column is a labelled group of links: in a ```md:columns block, a
     `#` heading over a list of links; otherwise a markdown list item whose text
     is the heading and whose nested list holds the links. The block is what a
     translated site needs — the i18n tools read one level of list, so a nested
     list's links stay in the source language. */
  const linksOf = (list = []) => list.map((item) => item.links?.[0]).filter(Boolean)
  const columns = (data?.columns?.items?.length
    ? data.columns.items.map((item) => ({ label: oneLine(item.title), links: linksOf(item.lists?.[0]) }))
    : (lists[0] || []).map((group) => ({ label: group.paragraphs?.[0] || '', links: linksOf(group.lists?.[0]) }))
  ).filter((c) => c.links.length > 0)

  return (
    <div className={cn('overflow-hidden', toneClass(tone), !signature && 'pb-14')}>
      <div className={edge === 'filmstrip' ? 'filmstrip' : 'selvedge'} aria-hidden="true" />
      {badge && <AnniversaryBadge title={badge} top={badgeTop} bottom={badgeBottom} size={badgeSize} closeLabel={badgeCloseLabel} />}
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 pt-20">
        <BusinessSchema />
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_0.8fr] lg:gap-16">
          <div>
            {paragraphs.map((p, i) => (
              <P key={i} text={p} className="font-display max-w-sm text-2xl leading-snug text-heading [&:not(:first-child)]:mt-4" />
            ))}
            {social.length > 0 && (
              <div className="mt-8 flex gap-3">
                {social.map((l, i) => (
                  <Link
                    key={i}
                    href={l.href}
                    aria-label={l.label}
                    className="grid size-11 place-items-center border border-border text-heading transition-colors hover:border-brand hover:bg-brand hover:text-paper"
                  >
                    <SocialIcon url={l.href} size={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {hours.length > 0 && (
            <div>
              <H3 text={hoursLabel} className="caps text-[0.625rem] text-accent-ink" />
              <dl className="mt-5">
                {hours.map((row, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-border py-2 text-sm">
                    <Text as="dt" text={row.title} className="text-body" />
                    <Text as="dd" text={row.text} className={isClosed(row.text) ? 'text-subtle' : 'text-heading'} />
                  </div>
                ))}
              </dl>
            </div>
          )}

          {columns.map((column, ci) => (
            <div key={ci}>
              <H3 text={column.label} className="caps text-[0.625rem] text-accent-ink" />
              <ul className="mt-5 space-y-3">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link {...linkProps(link)} className="nav-line text-body transition-colors hover:text-heading">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-7 sm:flex-row sm:items-center">
          <p className="caps text-[0.5625rem] text-subtle">
            © {new Date().getFullYear()} {title || website.name}{signoff ? ` — ${signoff}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {plain.map((l, i) => (
              <Link key={i} {...linkProps(l)} className="caps text-[0.5625rem] text-subtle transition-colors hover:text-heading">
                {l.label}
              </Link>
            ))}
            {/* The credit always links to the studio that built the site. */}
            {credit && (
              <Link href={CREDIT_HREF} className="caps text-[0.5625rem] text-subtle transition-colors hover:text-heading">{credit}</Link>
            )}
          </div>
        </div>
      </div>

      {/* The sign-off: the logo, or the wordmark at the width of the page, cropped at its foot. */}
      {!signature ? null : logo ? (
        <div aria-hidden="true" className="mx-auto flex max-w-[var(--max-content-width)] justify-center px-6 pb-16 pt-14">
          <img
            src={applyBasePath(logo, website.basePath)}
            alt=""
            loading="lazy"
            className="h-[clamp(9rem,24vw,14rem)] w-auto max-w-full object-contain"
          />
        </div>
      ) : (
        <div aria-hidden="true" className="mx-auto -mb-[4vw] mt-10 flex max-w-[var(--max-content-width)] justify-center px-6">
          <Wordmark name={mark.name} className="text-[clamp(5rem,24vw,21rem)]" />
        </div>
      )}
    </div>
  )
}

Footer.as = 'footer'
Footer.className = 'p-0'

export default Footer
