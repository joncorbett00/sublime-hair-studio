import { Link, cn } from '@uniweb/kit'

/**
 * The house button: square, wide capitals. See `.btn-*` in styles.css.
 *
 *   primary  the booking button — brand fill with a hairline rule inside the
 *            edge. Vermilion on paper and ink, paper on vermilion.
 *   outline  hairline in the heading colour
 *   ink      solid heading colour
 *
 * All of them fill from the left on hover. No shadows, so a pair of buttons
 * lines up exactly.
 *
 * Renders as a Link when given an href, a button otherwise.
 */
const SIZES = {
  sm: 'px-4 py-3 text-[0.625rem]',
  md: 'px-6 py-4 text-[0.6875rem]',
  lg: 'px-8 py-5 text-xs',
}

export default function Button({ href, to, tone = 'primary', size = 'md', className, children, ...rest }) {
  const classes = cn('btn', `btn-${tone}`, SIZES[size] || SIZES.md, 'disabled:pointer-events-none disabled:opacity-40', className)
  const target = href || to
  if (target) {
    return (
      <Link href={target} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
