import { defineSiteConfig } from '@uniweb/build/site'

// Options passed here REPLACE the framework's, key by key — except
// optimizeDeps.include / .exclude, which are added to rather than replaced.
// So `build: { sourcemap: true }` overrides the framework's whole build block;
// check what you are replacing before you pass one.
//
// The boutique has no server half: it sells in person, and every "Ask about
// this piece" is a mailto link.
//
// `seo` must be passed here: the build does not read `seo.baseUrl` from site.yml,
// and without it there is no sitemap.xml or robots.txt. Keep in step with site.yml.
export default defineSiteConfig({
  seo: {
    baseUrl: 'https://sublimehair.ca/shop',
    defaultImage: '/images/og-default.png',
  },
})
