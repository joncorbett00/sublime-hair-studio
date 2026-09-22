/**
 * Builds the foundation and both sites, and puts Bijou Boutique inside
 * Sublime Hair Studio's output at /shop/ — one folder to deploy:
 *
 *   sites/sublime/dist/          Sublime Hair Studio, at the deploy's base
 *   sites/sublime/dist/shop/     Bijou Boutique, at <base>shop/
 *
 *   pnpm build                              local build, base /
 *   UNIWEB_BASE=/repo/ pnpm build           under a subdirectory
 *   pnpm build --host=github-pages          host extras for the Sublime build
 *
 * Each site is built with its own base path so every link, asset and route
 * resolves under it; the shop's "Back to Sublime Hair Studio" bar (`/../`)
 * climbs one level out of it. When the boutique moves to its own domain,
 * build and deploy sites/bijou on its own and drop the copy step below.
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const uniweb = join(root, 'node_modules/.bin/uniweb')
const hostArgs = process.argv.slice(2).filter((a) => a.startsWith('--host'))

// One trailing slash, one leading slash: '/', '/repo/'.
const base = `/${(process.env.UNIWEB_BASE || '/').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

/** The folder a site is mounted at inside Sublime's output, and its base. */
const SHOP = 'shop'

function run(cwd, args, env = {}) {
  console.log(`\n→ ${cwd.replace(root, '') || '.'}: uniweb ${args.join(' ')}${env.UNIWEB_BASE ? `  (base ${env.UNIWEB_BASE})` : ''}`)
  execFileSync(uniweb, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })
}

function postbuild(site) {
  execFileSync('node', [join(root, 'scripts/postbuild.mjs'), site], { cwd: root, stdio: 'inherit' })
}

run(join(root, 'foundation'), ['build'])
run(join(root, 'sites/sublime'), ['build', ...hostArgs], { UNIWEB_BASE: base })
run(join(root, 'sites/bijou'), ['build'], { UNIWEB_BASE: `${base}${SHOP}/` })

// Tidy each site's own pages before one is nested in the other.
postbuild('sites/sublime')
postbuild('sites/bijou')

const target = join(root, 'sites/sublime/dist', SHOP)
if (existsSync(target)) rmSync(target, { recursive: true })
cpSync(join(root, 'sites/bijou/dist'), target, { recursive: true })

// Crawlers read only the robots.txt at the root, so it lists the shop's
// sitemap too.
const robots = join(root, 'sites/sublime/dist/robots.txt')
const shopSitemap = readFileSync(join(target, 'robots.txt'), 'utf8').match(/^Sitemap:.*$/m)?.[0]
if (shopSitemap && existsSync(robots) && !readFileSync(robots, 'utf8').includes(shopSitemap)) {
  appendFileSync(robots, `${shopSitemap}\n`)
}
console.log(`\n✓ Bijou Boutique copied into sites/sublime/dist/${SHOP}/ — deploy sites/sublime/dist.`)
