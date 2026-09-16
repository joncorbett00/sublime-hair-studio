import { useState } from 'react'
import { P, Icon, Link, Overlay, DataPlaceholder, cn } from '@uniweb/kit'
import Shout from '#components/Shout.jsx'
import Button from '#components/Button.jsx'
import { toneClass } from '#components/tone.js'

/** Each portrait stands on its own block of colour, in turn. */
const BLOCKS = ['var(--vermilion)', 'var(--marigold)', 'var(--bottle)']

/**
 * The team, cast like a show. Arched portraits on blocks of house colour, the
 * name in Bodoni, the role in wide capitals. Cards open a detail dialog rather
 * than navigating away, so someone comparing stylists never loses their place.
 */
export default function Crew({ content, params, block }) {
  const people = content.data?.crew || []
  const { pretitle, title, paragraphs } = content
  const { bookHref = '/book', columns = 3, tone = '' } = params
  const [open, setOpen] = useState(null)

  if (block.dataLoading) return <DataPlaceholder lines={8} />

  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }
  const first = (person) => person.title.split(' ')[0]

  return (
    <div className={toneClass(tone)}>
      <div className="mx-auto max-w-[var(--max-content-width)] px-6 py-[var(--section-padding-y)]">
        <Shout pretitle={pretitle} title={title} block={block}>
          {paragraphs.map((p, i) => (
            <P key={i} text={p} className={cn('max-w-xl text-lg leading-relaxed text-body', i === 0 ? 'mt-8' : 'mt-4')} />
          ))}
        </Shout>

        <ul className={cn('mt-20 grid grid-cols-1 gap-x-12 gap-y-20', cols[columns] || cols[3])}>
          {people.map((person, i) => (
            <li key={person.slug}>
              <button
                type="button"
                onClick={() => setOpen(person)}
                className="group block w-full text-left"
                aria-label={`Read more about ${person.title}`}
              >
                <div className="pr-5">
                  <div className="blocked arch" style={{ '--block': BLOCKS[i % BLOCKS.length], '--block-offset': '1rem' }}>
                    <img
                      src={person.image}
                      alt=""
                      className="arch aspect-[4/5] w-full object-cover grayscale-[35%] transition-[filter] duration-500 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mt-9">
                  <p className="font-display text-sm italic text-accent-ink" aria-hidden="true">No.&thinsp;{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-display mt-1 text-[2rem] font-medium leading-tight tracking-tight text-heading">
                    {person.title}
                  </h3>
                  <p className="caps mt-2 text-[0.625rem] text-heading">
                    {person.role}
                    {person.pronouns && <span className="font-normal normal-case tracking-normal text-subtle [font-stretch:100%]">&ensp;{person.pronouns}</span>}
                  </p>
                  {person.tagline && <p className="mt-4 leading-relaxed text-body">{person.tagline}</p>}

                  {person.specialties?.length > 0 && (
                    <p className="font-display mt-4 italic text-subtle">{person.specialties.join(' / ')}</p>
                  )}
                  <span className="text-cta mt-6">
                    Meet {first(person)} <Icon name="lu-arrow-right" size="13" />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {open && (
          <Overlay onClose={() => setOpen(null)} className="items-center bg-ink/70 p-5">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="crew-name"
              className="context-light framed laid max-h-[88vh] w-full max-w-3xl overflow-y-auto bg-section"
            >
              <div className="grid sm:grid-cols-[15rem_1fr]">
                <img src={open.image} alt="" className="h-60 w-full object-cover sm:h-full" />
                <div className="p-7 sm:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 id="crew-name" className="font-display text-4xl font-medium tracking-tight text-heading sm:text-5xl">
                        {open.title}
                      </h2>
                      <p className="caps mt-2 text-[0.625rem] text-heading">{open.role}</p>
                      {open.pronouns && <p className="mt-1 text-sm text-subtle">{open.pronouns}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(null)}
                      aria-label="Close"
                      className="grid size-10 shrink-0 place-items-center border border-heading/30 text-heading hover:bg-muted"
                    >
                      <Icon name="lu-x" size="18" />
                    </button>
                  </div>

                  <p className="mt-6 leading-relaxed text-body">{open.bio}</p>
                  <dl className="mt-7 space-y-5 border-t border-heading/25 pt-6">
                    {open.favouriteThing && (
                      <div>
                        <dt className="caps text-[0.5625rem] text-subtle">Favourite part of the job</dt>
                        <dd className="font-display mt-1.5 text-lg italic leading-snug text-heading">{open.favouriteThing}</dd>
                      </div>
                    )}
                    {open.worstHaircut && (
                      <div>
                        <dt className="caps text-[0.5625rem] text-subtle">Worst haircut they have ever had</dt>
                        <dd className="font-display mt-1.5 text-lg italic leading-snug text-heading">{open.worstHaircut}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Button href={bookHref} onClick={() => setOpen(null)}>
                      Book with {first(open)}
                    </Button>
                    {open.instagram && (
                      <Link href={open.instagram} className="text-cta">
                        <Icon name="lu-instagram" size="14" /> Their work
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  )
}
