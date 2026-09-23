import { Link, H3, P, SocialIcon, filterSocialLinks, useWebsite, applyBasePath } from '@uniweb/kit'
import BusinessSchema from '#components/BusinessSchema.jsx'
import Wordmark from '#components/Wordmark.jsx'
import { wordmarkParts } from '#utils/wordmark.js'
import { linkProps } from '#utils/links.js'

/**
 * Footer, on ink. Blurb, socials, opening hours and the link columns across
 * the top; along the bottom the wordmark set as wide as the page, the way a
 * label signs off — or, with a `logo` image, the logo, centred. Takes the hours and columns as
 * authored markdown so the business can change them without anyone opening
 * this file. The edge along its top matches the masthead's.
 */
function Footer({ content, params }) {
  const { website } = useWebsite()
  const { title, paragraphs, links, lists, data } = content
  const social = filterSocialLinks(links)
  const plain = links.filter((l) => !social.includes(l))
  const hours = data?.hours || []
  const { credit = '', creditHref = '', signoff = '', edge = 'selvedge', wordmark = '', logo = '' } = params
  const mark = wordmarkParts(website.name, { wordmark })

  /* Each link column is a labelled group: a markdown list item whose text is
     the heading and whose nested list holds the links. */
  const columns = (lists[0] || [])
    .map((group) => ({
      label: group.paragraphs?.[0] || '',
      links: (group.lists?.[0] || []).map((item) => item.links?.[0]).filter(Boolean),
    }))
    .filter((c) => c.links.length > 0)

  return (
    <div className="tone tone-ink overflow-hidden">
      <div className={edge === 'filmstrip' ? 'filmstrip' : 'selvedge'} aria-hidden="true" />
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
              <H3 text="Hours" className="caps text-[0.625rem] text-accent-ink" />
              <dl className="mt-5">
                {hours.map((row, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-border py-2 text-sm">
                    <dt className="text-body">{row.day}</dt>
                    <dd className={/closed/i.test(row.open) ? 'text-subtle' : 'text-heading'}>{row.open}</dd>
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
            {credit && (creditHref ? (
              <Link href={creditHref} className="caps text-[0.5625rem] text-subtle transition-colors hover:text-heading">{credit}</Link>
            ) : (
              <span className="caps text-[0.5625rem] text-subtle">{credit}</span>
            ))}
          </div>
        </div>
      </div>

      {/* The sign-off: the logo, or the wordmark at the width of the page, cropped at its foot. */}
      {logo ? (
        <div aria-hidden="true" className="mx-auto flex max-w-[var(--max-content-width)] justify-center px-6 pb-16 pt-14">
          <img
            src={applyBasePath(logo, website.basePath)}
            alt=""
            width="640"
            height="640"
            loading="lazy"
            className="size-[clamp(9rem,24vw,14rem)] object-contain"
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
