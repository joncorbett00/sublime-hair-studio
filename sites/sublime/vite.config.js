import { defineSiteConfig } from '@uniweb/build/site'

// Options passed here REPLACE the framework's, key by key — except
// optimizeDeps.include / .exclude, which are added to rather than replaced.
// So `build: { sourcemap: true }` overrides the framework's whole build block;
// check what you are replacing before you pass one.
//
// The salon site has no server half: booking is Square Appointments (see
// pages/book/page.yml) and selling is the separate shop site.
export default defineSiteConfig({
  plugins: [homepageMetaStripper()],
})

/**
 * With `seo` on, the build writes the HOME page's canonical and social tags into
 * the HTML shell that every page is prerendered from, and prerendering then adds
 * each page's own tags after them. Every inner page ended up with two canonicals,
 * the first pointing at the home page. Remove the shell's copies so each page
 * carries only its own. (og:site_name is shell-only, so it stays.)
 */
function homepageMetaStripper() {
  const duplicated = [
    /\s*<link rel="canonical"[^>]*>/g,
    /\s*<meta property="og:(?:type|title|description|url|image)"[^>]*>/g,
    /\s*<meta name="twitter:[a-z]+"[^>]*>/g,
  ]
  return {
    name: 'sublime:strip-homepage-meta',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => duplicated.reduce((out, pattern) => out.replace(pattern, ''), html),
    },
  }
}
