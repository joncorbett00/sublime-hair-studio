import { Link, Icon, cn, useScrolled, useMobileMenu, useWebsite, useActiveRoute, applyBasePath } from '@uniweb/kit'
import Button from '#components/Button.jsx'
import Wordmark from '#components/Wordmark.jsx'
import { wordmarkParts } from '#utils/wordmark.js'
import PaletteSwitcher from '#components/PaletteSwitcher.jsx'
import { linkProps } from '#utils/links.js'

const isExternal = (href = '') => /^https?:\/\//.test(href)

/** One nav link in wide capitals; a brand-colour hairline draws in under it. */
function NavLink({ link, active, onClick, className }) {
  return (
    <Link
      {...linkProps(link)}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'nav-line caps inline-flex items-center gap-1 whitespace-nowrap py-1.5 text-[0.6875rem] text-heading transition-colors hover:text-accent-ink',
        active && 'is-active',
        className
      )}
    >
      {link.label}
      {isExternal(link.href) && <Icon name="lu-arrow-up-right" size="12" className="text-subtle" />}
    </Link>
  )
}

/**
 * A slim ink bar above the masthead that leads out to another site — how the
 * shop, served under the salon's domain, gets you back to the salon.
 */
function ReturnBar({ link, className }) {
  return (
    <div className={cn('return-bar tone tone-ink', className)}>
      <div className="mx-auto flex h-8 max-w-[var(--max-content-width)] items-center px-4 sm:px-6">
        <Link
          {...linkProps(link)}
          className="caps inline-flex items-center gap-2 text-[0.5625rem] text-body transition-colors hover:text-accent-ink"
        >
          <Icon name="lu-arrow-left" size="12" />
          {link.label}
        </Link>
      </div>
    </div>
  )
}

/**
 * Fixed masthead: the edge along the very top (a brand-colour selvedge, or a
 * film strip), the wordmark — or the `logo` image — at the centre and the nav split evenly either
 * side of it, with the button last on the right. Once the page scrolls the
 * bar turns to frosted paper and the wordmark steps down a size.
 *
 * With `nav: authored` the links authored in header.md ARE the nav, in order.
 * With `nav: pages` it is the page nav (minus home — the wordmark is the home
 * link) followed by any authored links. Either way a link to `ctaHref` is
 * drawn as the button; if there is none, one is added at the end.
 *
 * `returnLabel` + `returnHref` add a slim bar above it all that leads to
 * another site (see ReturnBar). A `yaml:palettes` block turns on the floating
 * palette picker (components/PaletteSwitcher.jsx).
 */
function Header({ content, params }) {
  const { website } = useWebsite()
  const scrolled = useScrolled(16)
  const { isOpen: mobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu()
  const { isActiveOrAncestor } = useActiveRoute()
  const {
    ctaHref = '/book',
    ctaMobileLabel = '',
    nav = 'pages',
    edge = 'selvedge',
    wordmark = '',
    wordmarkTagline = '',
    logo = '',
    returnLabel = '',
    returnHref = '',
  } = params

  const siteName = website.name || ''
  const mark = wordmarkParts(siteName, { wordmark, tagline: wordmarkTagline })
  const edgeClass = edge === 'filmstrip' ? 'filmstrip' : 'selvedge'
  const returnLink = returnLabel && returnHref ? { label: returnLabel, href: returnHref, reload: true } : null
  const authored = (content.links || []).map((l) => ({ label: l.label, href: l.href, reload: l.reload, target: l.target }))

  const links = nav === 'authored'
    ? authored
    : [
        ...website
          .getPageHierarchy({ for: 'header' })
          .filter((page) => page.navigableRoute !== '/')
          .map((page) => ({ label: page.label || page.title, href: page.navigableRoute, page })),
        ...authored,
      ]

  const ctaLink = links.find((l) => l.href === ctaHref) || { label: 'Book now', href: ctaHref }
  const navLinks = links.filter((l) => l !== ctaLink)
  // Phones get one word, so the button balances the menu toggle across the
  // wordmark: "Book now" → "Book", "Visit us" → "Visit".
  const ctaShort = String(ctaLink.label || '').split(/\s+/)[0]

  /* Only same-site paths without a hash can be "the page you are on". */
  const isActive = (link) => {
    if (link.page) return isActiveOrAncestor(link.page)
    if (!link.href?.startsWith('/') || link.href.includes('#')) return false
    const target = link.href.replace(/^\/+|\/+$/g, '')
    return target !== '' && isActiveOrAncestor(target)
  }

  /* Split evenly, counting the button as one of the right-hand items. */
  const half = Math.floor((navLinks.length + 1) / 2)
  const left = navLinks.slice(0, half)
  const right = navLinks.slice(half)

  return (
    <>
      {/* A button rather than `<a href="#…">`: the runtime owns in-page anchors
          and swallows the activation before React sees it, so focus never moved. */}
      <button
        type="button"
        onClick={() => document.getElementById('content-start')?.focus()}
        className="btn btn-primary sr-only z-50 px-5 py-3 text-xs focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </button>

      {/* Fixed, not sticky: the runtime wraps this section in elements exactly as
          tall as the bar, so sticky had no room. The spacer holds its place:
          the same edge and return bar, and the bar's height plus its border. */}
      <div aria-hidden="true" className="invisible">
        <div className={edgeClass} />
        {returnLink && <div className="h-8" />}
        <div className="h-[calc(var(--header-height)+1px)]" />
      </div>
      <div className="fixed inset-x-0 top-0 z-40">
        <div className={edgeClass} aria-hidden="true" />
        {returnLink && <ReturnBar link={returnLink} />}
        <div
          className={cn(
            'border-b transition-[background-color,border-color] duration-300',
            scrolled || mobileOpen
              ? 'border-heading/15 bg-section/92 backdrop-blur-md'
              : 'border-transparent bg-section'
          )}
        >
          <nav
            aria-label="Main"
            className="mx-auto grid h-[var(--header-height)] max-w-[var(--max-content-width)] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:gap-8"
          >
            {/* Left: menu toggle on small screens, first half of the nav on large. */}
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={toggleMobile}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className="-ml-2 grid size-11 place-items-center text-heading lg:hidden"
              >
                <Icon name={mobileOpen ? 'lu-x' : 'lu-menu'} size="22" />
              </button>
              <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
                {left.map((link) => (
                  <li key={link.href}><NavLink link={link} active={isActive(link)} /></li>
                ))}
              </ul>
            </div>

            <Link href="/" aria-label={`${siteName} — home`} className="flex justify-center">
              {logo ? (
                <img
                  src={applyBasePath(logo, website.basePath)}
                  alt=""
                  width="640"
                  height="640"
                  className={cn(
                    'size-[calc(var(--header-height)-0.75rem)] origin-center object-contain transition-transform duration-300',
                    scrolled && 'scale-[0.86]'
                  )}
                />
              ) : (
                <Wordmark
                  name={mark.name}
                  tagline={mark.tagline}
                  className={cn(
                    'origin-center transition-transform duration-300 text-[2.375rem] sm:text-[2.75rem]',
                    scrolled && 'scale-[0.86]'
                  )}
                />
              )}
            </Link>

            {/* Right: second half of the nav, then the button. */}
            <div className="flex items-center justify-end gap-8 xl:gap-10">
              <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
                {right.map((link) => (
                  <li key={link.href}><NavLink link={link} active={isActive(link)} /></li>
                ))}
              </ul>
              <Button {...linkProps(ctaLink)} size="sm" className="!px-3.5 sm:!px-5">
                <span className="sm:hidden">{ctaShort}</span>
                <span className="hidden sm:inline">{ctaLink.label}</span>
              </Button>
            </div>
          </nav>
        </div>

        {mobileOpen && (
          <div className="max-h-[calc(100svh-var(--header-height))] overflow-y-auto border-b border-heading/15 bg-section lg:hidden">
            <ul className="px-6 pb-4 pt-2">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-border last:border-0">
                  <Link
                    {...linkProps(link)}
                    onClick={closeMobile}
                    aria-current={isActive(link) ? 'page' : undefined}
                    className={cn(
                      'font-display flex items-center justify-between py-4 text-3xl font-medium tracking-tight',
                      isActive(link) ? 'italic text-accent-ink' : 'text-heading'
                    )}
                  >
                    {link.label}
                    <Icon name={isExternal(link.href) ? 'lu-arrow-up-right' : 'lu-arrow-right'} size="20" className="text-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-6 pb-7">
              <Button {...linkProps(ctaLink)} size="lg" className="w-full" onClick={closeMobile}>
                {ctaMobileLabel || ctaLink.label}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Landing target for the skip link. */}
      <div id="content-start" tabIndex={-1} className="sr-only" />

      {/* Trying other colours: on while header.md has a `yaml:palettes` block. */}
      <PaletteSwitcher palettes={content.data?.palettes || []} storageKey={mark.name || 'site'} />
    </>
  )
}

Header.as = 'header'
Header.className = 'p-0'

export default Header
