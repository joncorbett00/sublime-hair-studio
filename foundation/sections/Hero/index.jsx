import { H1, P, Icon, cn } from '@uniweb/kit'
import Button from '#components/Button.jsx'
import Seal from '#components/Seal.jsx'
import { Eyebrow } from '#components/Shout.jsx'

/**
 * Front-door hero, set like a magazine cover. A poster-sized Bodoni headline,
 * intro and buttons on the left, and a row of headline numbers under a ruled
 * line. On the right, the upstairs-window arch: the first photo in the arch
 * with a solid vermilion block behind it and an ink hairline arch offset the
 * other way; the second photo tucked against its foot on a bottle-green
 * block; the turning seal on top; and a running caption up the side.
 */
export default function Hero({ content, params, block }) {
  const { pretitle, title, paragraphs, links, images, data } = content
  const { layout = 'split', stamp = '' } = params
  const facts = data?.facts || []
  const [main, inset] = images
  const split = layout !== 'stacked' && main

  return (
    <div className="relative mx-auto max-w-[var(--max-content-width)] px-6 pb-20 pt-10 lg:pb-28 lg:pt-14">
      <div className={cn('grid items-center gap-16 lg:gap-12', split && 'lg:grid-cols-[1.25fr_1fr]')}>
        <div className="rise">
          {pretitle && <Eyebrow block={block} className="mb-8">{pretitle}</Eyebrow>}

          <H1
            text={title}
            className="font-display text-heading text-[clamp(3.25rem,6.4vw,6.25rem)]/[0.92] font-medium tracking-[-0.035em]"
          />

          {paragraphs.map((p, i) => (
            <P
              key={i}
              text={p}
              className={cn('text-lg leading-relaxed text-body', split ? 'max-w-lg' : 'max-w-2xl', i === 0 ? 'mt-8' : 'mt-4')}
            />
          ))}

          {links.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {links.map((link, i) => (
                <Button key={i} href={link.href} tone={i === 0 ? 'primary' : 'outline'} size="lg">
                  {link.label}
                  {i === 0 && <Icon name="lu-arrow-right" size="16" />}
                </Button>
              ))}
            </div>
          )}

          {facts.length > 0 && (
            <dl className={cn('mt-14 grid grid-cols-3 border-t border-heading', split ? 'max-w-xl' : 'max-w-3xl')}>
              {facts.map((f, i) => (
                <div key={i} className={cn('pr-3 pt-5', i > 0 && 'border-l border-heading/20 pl-4 sm:pl-6')}>
                  <dt className="font-display whitespace-nowrap text-[1.625rem] font-medium italic leading-none text-heading sm:text-4xl">{f.value}</dt>
                  <dd className="caps mt-3 text-[0.5625rem] leading-snug text-subtle sm:text-[0.625rem]">{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {split && (
          <div className="relative mx-auto w-full max-w-[26rem] pb-12 pr-6 sm:pr-10 lg:mr-0 lg:max-w-[31rem]">
            <figure className="relative ml-10 sm:ml-16">
              {/* Hairline arch thrown up and left, the colour block down and right. */}
              <span aria-hidden="true" className="arch absolute inset-0 -translate-x-4 -translate-y-4 border border-heading" />
              <div className="blocked arch [--block:var(--vermilion)]">
                <img
                  src={main.url || main.src}
                  alt={main.alt || ''}
                  className="arch aspect-[4/5] w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {main.alt && (
                <figcaption className="figcap running absolute -right-8 bottom-0 whitespace-nowrap sm:-right-10">
                  <b>Look 01</b>&ensp;—&ensp;{main.alt}
                </figcaption>
              )}
            </figure>

            {inset && (
              <figure className="blocked block-left absolute bottom-0 left-0 w-[44%] [--block:var(--bottle)] [--block-offset:0.75rem]">
                <img
                  src={inset.url || inset.src}
                  alt={inset.alt || ''}
                  className="aspect-square w-full border-[6px] border-section object-cover"
                  loading="eager"
                />
              </figure>
            )}

            {stamp && (
              <div className="absolute -top-6 right-0 sm:-top-8">
                <Seal text={stamp} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
