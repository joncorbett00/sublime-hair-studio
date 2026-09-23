import { Link, cn } from '@uniweb/kit'
import PieceTag from '#components/PieceTag.jsx'
import { money } from '#components/money.js'
import { photo, photoSrcSet } from '#utils/finds.js'

/** A link when there is a page to go to, else the same content unlinked. */
function MaybeLink({ href, className, children, ...rest }) {
  return href
    ? <Link href={href} className={className} {...rest}>{children}</Link>
    : <div className={className}>{children}</div>
}

/**
 * One find: the photo in a soft-cornered mat with its tag hanging over the
 * corner, then its label and era, the name of the piece, and size and price
 * on one ruled line.
 *
 *   size   'md' for the grid, 'lg' for the lead new arrival
 */
export default function PieceCard({ piece, isNew = false, size = 'md', eager = false, className }) {
  const { title, designer, era, size: fit, price, image, category, $route } = piece
  const lg = size === 'lg'

  return (
    <MaybeLink href={$route} className={cn('group block', className)}>
      <div className="relative">
        <div className="mat gate transition-transform duration-500 group-hover:-translate-y-1.5">
          <img
            src={photo(image, lg ? 1200 : 700)}
            srcSet={photoSrcSet(image)}
            sizes={lg ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw'}
            alt={title}
            loading={eager ? 'eager' : 'lazy'}
            className={cn('w-full object-cover', lg ? 'aspect-[4/5] lg:aspect-[5/6]' : 'aspect-[4/5]')}
          />
        </div>
        <PieceTag category={category} isNew={isNew} className="absolute -left-2 top-6" />
      </div>

      <div className={cn('mt-6', lg && 'mt-8')}>
        {(designer || era) && (
          <p className="caps text-[0.5625rem] text-subtle">
            {designer && <span className="font-display text-[0.8125rem] font-medium normal-case italic tracking-normal text-accent-ink [font-stretch:normal]">{designer}</span>}
            {designer && era ? <>&ensp;·&ensp;</> : null}
            {era}
          </p>
        )}
        <h3
          className={cn(
            'font-display mt-2 font-medium tracking-[-0.015em] text-heading transition-colors group-hover:text-accent-ink',
            lg ? 'text-[clamp(1.75rem,3vw,2.5rem)]/[1.05]' : 'text-[1.375rem]/[1.15]'
          )}
        >
          {title}
        </h3>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-heading/25 pt-3">
          <span className="caps text-[0.5625rem] text-subtle">{fit}</span>
          <span className="font-display text-lg font-medium text-heading">{price ? money(price) : 'Ask'}</span>
        </div>
      </div>
    </MaybeLink>
  )
}
