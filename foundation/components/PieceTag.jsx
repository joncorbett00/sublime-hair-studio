import { cn } from '@uniweb/kit'

/**
 * The swing tag a piece hangs from: its category, and "Just in" on the
 * newest finds, whose tag is the green. See `.tag` in styles.css. `newLabel`
 * is the section's words for it.
 */
export default function PieceTag({ category, isNew, newLabel = 'Just in', className }) {
  if (!category && !(isNew && newLabel)) return null
  return (
    <span className={cn('tag', isNew && 'tag-new swing', className)}>
      {category ? <b>{category}</b> : null}
      {isNew && newLabel ? <span>{newLabel}</span> : null}
    </span>
  )
}
