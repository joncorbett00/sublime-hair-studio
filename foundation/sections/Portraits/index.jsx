import { P, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import { toneClass } from '#components/tone.js'

/**
 * A few portraits with their whole story showing — the studio dogs, a founder
 * and a partner, anyone who deserves more than a card. Same arched mat as the
 * crew, but written in markdown and read in place rather than in a dialog.
 *
 * Each `###` item is one portrait: the heading is the name, `####` a short
 * line under it (breed, years, role), then one photo and the story.
 */
export default function Portraits({ content, params, block }) {
  const { pretitle, title, paragraphs, items } = content
  const { columns = 2, tone = '' } = params
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3' }

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <Shout pretitle={pretitle} title={title} block={block}>
          {paragraphs.map((p, i) => (
            <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
          ))}
        </Shout>

        <ul className={cn('mt-20 grid grid-cols-1 gap-x-16 gap-y-20 lg:gap-x-24', cols[columns] || cols[2])}>
          {items.map((item, i) => {
            const image = item.images?.[0]
            return (
              <li key={i} className={cn(columns == 2 && i % 2 === 1 && 'md:mt-24')}>
                {image && (
                  <div className="mat arch mx-auto max-w-md md:mx-0">
                    <img
                      src={image.url || image.src}
                      alt={image.alt || ''}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="mt-9 max-w-md">
                  <h3 className="font-display text-[2.5rem] font-medium leading-tight tracking-tight text-heading">
                    {item.title}
                  </h3>
                  {item.subtitle && <p className="caps mt-2 text-[0.625rem] text-heading">{item.subtitle}</p>}
                  {item.paragraphs.map((p, j) => (
                    <P key={j} text={p} className={cn('leading-relaxed text-body', j === 0 ? 'mt-6' : 'mt-4')} />
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
