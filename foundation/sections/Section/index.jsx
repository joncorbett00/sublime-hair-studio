import { H1, H2, P, cn } from '@uniweb/kit'
import Button from '#components/Button.jsx'

/**
 * Section Component
 *
 * A versatile content section that handles headings, text, and links.
 * Uses semantic tokens so it adapts to any theme context automatically.
 */
export default function Section({ content, params }) {
  const { title, pretitle, subtitle, paragraphs = [], links = [], images = [] } = content || {}

  const {
    align = 'center',
    width = 'default',
  } = params || {}

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const widths = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-none',
  }

  return (
    <div className={cn('py-[var(--section-padding-y)] px-6', alignments[align])}>
      <div className={cn('mx-auto', widths[width])}>
        {pretitle && (
          <p className="caps mb-5 text-[0.6875rem] text-accent-ink">
            {pretitle}
          </p>
        )}

        {title && (
          <H1
            text={title}
            className="font-display mb-5 text-4xl font-medium leading-[1.02] tracking-tight text-heading sm:text-5xl"
          />
        )}

        {subtitle && (
          <H2
            text={subtitle}
            className="text-body text-xl mb-6"
          />
        )}

        {paragraphs.map((para, index) => (
          <P
            key={index}
            text={para}
            className="text-body text-lg mb-4 leading-relaxed"
          />
        ))}

        {links.length > 0 && (
          <div className={cn('mt-8 flex gap-4 flex-wrap', align === 'center' && 'justify-center')}>
            {links.map((link, index) => (
              <Button key={index} href={link.href} tone={index === 0 ? 'primary' : 'outline'}>
                {link.label}
              </Button>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-8">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.url || img.src}
                alt={img.alt || ''}
                className="mx-auto"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
