import { useState } from 'react'
import { H1, P, Icon, Link, cn, useFormSubmit } from '@uniweb/kit'
import { oneLine } from '#utils/text.js'
import { linkProps } from '#utils/links.js'
import Button from '#components/Button.jsx'

/**
 * A holding page: a headline, a line of copy and a single email box for
 * "tell me when you open". Each sign-up goes to the site's submit service as
 * `{ email }`. With no submit destination the box is not drawn at all — the
 * authored links (Instagram, say) are what's left.
 */
export default function ComingSoon({ content, params, block }) {
  const { pretitle, title, paragraphs, links } = content
  const { placeholder, buttonLabel, thanks, failed } = params
  const [email, setEmail] = useState('')
  const { submit, status, canSubmit } = useFormSubmit({
    block,
    context: { formId: 'launch-signup' },
    summary: (v) => ({ title: v.email, subtitle: 'Launch sign-up' }),
  })

  const onSubmit = (e) => {
    e.preventDefault()
    submit({ email: email.trim() }).catch(() => {})
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-[var(--section-padding-y)] text-center">
      {pretitle && <p className="caps mb-5 text-[0.6875rem] text-accent-ink">{pretitle}</p>}
      {title && (
        <H1
          text={oneLine(title)}
          className="font-display text-balance text-4xl font-medium leading-[1.02] tracking-tight text-heading sm:text-6xl"
        />
      )}
      {paragraphs.map((p, i) => (
        <P key={i} text={p} className="mt-5 text-pretty text-lg leading-relaxed text-body" />
      ))}

      {canSubmit && (status === 'success' ? (
        <p role="status" className="font-display mt-10 text-xl italic text-heading">{thanks}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 w-full">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor={`${block.stableId}-email`} className="sr-only">Email</label>
            <input
              id={`${block.stableId}-email`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 border border-heading/30 bg-transparent px-4 py-4 text-base text-heading placeholder:text-subtle focus:border-heading focus:outline-none"
            />
            <Button type="submit" disabled={status === 'submitting'}>{buttonLabel}</Button>
          </div>
          {status === 'error' && <p role="alert" className="mt-3 text-sm text-error">{failed}</p>}
        </form>
      ))}

      {links.length > 0 && (
        <div className={cn('flex flex-wrap justify-center gap-6', canSubmit ? 'mt-8' : 'mt-10')}>
          {links.map((link, i) => (
            <Link key={i} {...linkProps(link)} className="text-cta">
              {link.label} <Icon name="lu-arrow-right" size="13" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
