import { cn } from '@uniweb/kit'

/**
 * The wardrobe tag a piece hangs from: its category, and "Just in" on the
 * newest finds, whose tag is the green. See `.tag` in styles.css.
 */
export default function PieceTag({ category, isNew, className }) {
  if (!category && !isNew) return null
  return (
    <span className={cn('tag', isNew && 'tag-new swing', className)}>
      {category ? <b>{category}</b> : null}
      {isNew ? <span>Just in</span> : null}
    </span>
  )
}
