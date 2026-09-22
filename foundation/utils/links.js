/**
 * The links an author wrote on a line of their own — the ones a section draws
 * as buttons.
 *
 * This parser (@uniweb 0.62) lists a link written INSIDE a sentence in
 * `content.links` as well as leaving it in the paragraph, so a section that
 * drew every link as a button would show it twice: once in the text and once
 * as a stray button. Keep only links that appear in no paragraph.
 */
export function buttonLinks(content) {
  const text = (content.paragraphs || []).join('\n')
  return (content.links || []).filter((l) => !text.includes(`href="${l.href}"`))
}

/**
 * The props that carry an authored link onto a <Link> or <Button>.
 *
 * `{reload}` after a link in markdown makes it a full page load instead of an
 * in-site route change. That is how one site links to another served under
 * the same domain — Sublime's `[Shop](/shop/){reload}`, and Bijou's
 * `[Sublime Hair Studio](/../){reload}` back up out of /shop/. Both are joined
 * to the site's base path, so they keep working under a subdirectory deploy.
 */
export function linkProps(link = {}) {
  return {
    href: link.href,
    ...(link.reload ? { reload: true } : {}),
    ...(link.target ? { target: link.target } : {}),
  }
}
