/**
 * Runs after `uniweb build`, over one prerendered site:
 *
 *   node scripts/postbuild.mjs sites/bijou
 *
 * (scripts/build.mjs runs it for every site.) Fixes four things the build
 * (@uniweb/build 0.58) gets wrong:
 *
 *  1. The HTML shell every page is rendered from carries the HOME page's
 *     canonical, og:* and twitter:* tags, and each page's own come after them.
 *     Inner pages ended up with the homepage's canonical, and two of each
 *     social tag. Keep the page's own; drop the shell's.
 *  2. Pages had no canonical of their own and a relative og:url. Every page
 *     now gets an absolute one of each.
 *  3. A piece's page shared the site's default card. It now shares the piece's
 *     photo, so a link sent to a friend shows the coat, not the logo.
 *  4. sitemap.xml listed the parametric page as `/finds/:slug`. It now lists
 *     the pages that were actually built — the finds on the site today.
 *
 * 3 and 4 are Bijou's (a site with a `finds` query); on other sites they find
 * nothing to do.
 *
 * Idempotent: running it twice gives the same files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const siteDir = join(root, process.argv[2] || 'sites/bijou')
const dist = join(siteDir, 'dist')
const siteYml = readFileSync(join(siteDir, 'site.yml'), 'utf8')
const base = (siteYml.match(/^\s*baseUrl:\s*(\S+)/m)?.[1] || '').replace(/\/+$/, '')

if (!existsSync(dist)) {
  console.error(`postbuild: ${dist} not found — run \`uniweb build\` first.`)
  process.exit(1)
}
if (!base) {
  console.error(`postbuild: no seo.baseUrl in ${siteDir}/site.yml.`)
  process.exit(1)
}

// The pieces the build knew about, for their photos.
const finds = (() => {
  try {
    const data = JSON.parse(readFileSync(join(dist, 'data/finds.json'), 'utf8'))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
})()
const pieceBySlug = new Map(finds.map((p) => [p.slug, p]))

const pages = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (name === 'index.html') pages.push(path)
  }
})(dist)

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Keep only the LAST tag matching `pattern` — the page's own. */
function keepLast(html, pattern) {
  const matches = html.match(pattern) || []
  if (matches.length < 2) return html
  let seen = 0
  return html.replace(pattern, (m) => (++seen < matches.length ? '' : m))
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`)
  const tag = `<meta ${attr}="${key}" content="${escape(value)}">`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}</head>`)
}

function photo(src, width) {
  if (!/images\.unsplash\.com/.test(src)) return src.startsWith('http') ? src : `${base}${src}`
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('h', String(Math.round(width * 0.525)))
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('crop', 'faces,center')
  url.searchParams.set('q', '80')
  url.searchParams.set('fm', 'jpg')
  return url.toString()
}

const routes = []
for (const file of pages) {
  const rel = relative(dist, file).split(sep).slice(0, -1).join('/')
  const route = rel ? `/${rel}` : '/'
  const url = rel ? `${base}${route}` : `${base}/`
  routes.push(route)

  let html = readFileSync(file, 'utf8')

  // 1 + 2: one canonical, the page's own.
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, '')
  html = html.replace('</head>', `<link rel="canonical" href="${url}"></head>`)
  for (const key of ['type', 'title', 'description', 'url', 'image']) {
    html = keepLast(html, new RegExp(`\\s*<meta property="og:${key}"[^>]*>`, 'g'))
  }
  for (const key of ['card', 'title', 'description', 'image']) {
    html = keepLast(html, new RegExp(`\\s*<meta name="twitter:${key}"[^>]*>`, 'g'))
  }
  html = setMeta(html, 'property', 'og:url', url)

  // 3: a piece shares its own photo.
  const slug = route.match(/^\/finds\/([^/]+)$/)?.[1]
  const piece = slug && pieceBySlug.get(slug)
  if (piece?.image) {
    const card = photo(piece.image, 1200)
    html = setMeta(html, 'property', 'og:image', card)
    html = setMeta(html, 'name', 'twitter:image', card)
    html = setMeta(html, 'property', 'og:image:alt', piece.title)
  }

  writeFileSync(file, html)
}

// 4: the sitemap lists the pages that exist.
const sitemapPath = join(dist, 'sitemap.xml')
if (existsSync(sitemapPath)) {
  let xml = readFileSync(sitemapPath, 'utf8')
  const blocks = xml.match(/\s*<url>[\s\S]*?<\/url>/g) || []
  const template = blocks.find((b) => b.includes('/finds/:slug'))
  if (template) {
    const listed = new Set(blocks.map((b) => b.match(/<loc>([^<]*)<\/loc>/)?.[1]))
    const pieces = routes
      .filter((r) => /^\/finds\/[^/]+$/.test(r))
      .map((r) => `${base}${r}`)
      .filter((loc) => !listed.has(loc))
      .map((loc) => template.replace(/<loc>[^<]*<\/loc>/, `<loc>${loc}</loc>`).replace(/<priority>[^<]*<\/priority>/, '<priority>0.6</priority>'))
    xml = xml.replace(template, pieces.join(''))
    writeFileSync(sitemapPath, xml)
  }
}

console.log(`postbuild (${process.argv[2] || 'sites/bijou'}): ${pages.length} pages tidied, ${routes.filter((r) => r.startsWith('/finds/')).length} finds in the sitemap.`)
