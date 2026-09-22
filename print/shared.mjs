/**
 * What the print pieces share: the site's data (services, business details),
 * the brand tokens and wordmark, and rendering HTML to PDF with Chrome.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')
export const site = join(root, 'sites/sublime')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

/* ---------- data ---------- */

const dir = join(site, 'records/services')
export const services = readdirSync(dir)
  .filter((f) => f.endsWith('.yml'))
  .flatMap((f) => parse(readFileSync(join(dir, f), 'utf8')) || [])
  .sort((a, b) => a.order - b.order)

export const byCategory = (name) => services.filter((s) => s.category === name)

/** A service by slug. Throws, so a renamed slug fails the build instead of printing a blank. */
export function service(slug) {
  const s = services.find((x) => x.slug === slug)
  if (!s) throw new Error(`No service "${slug}" in sites/sublime/records/services`)
  return s
}

export const { business, booking } = parse(readFileSync(join(site, 'site.yml'), 'utf8'))
const short = (day) => day.slice(0, 3)
const clock = (t) => String(Number(t.split(':')[0]) % 12 || 12)
export const hours = business.hours
  .map((h) => `${short(h.days[0])}–${short(h.days.at(-1))} ${clock(h.opens)}–${clock(h.closes)}`)
  .join(' · ')
export const phone = business.telephone.replace(/^\+1-/, '').replace(/-/g, '.')
export const domain = business.url.replace(/^https?:\/\//, '')

/* ---------- markup ---------- */

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** "from $85", "$55", "save $20" after the number, or the note alone for a quoted price. */
export function price(s) {
  const note = s.priceNote || ''
  if (!(Number(s.price) > 0)) return `<span class="quoted">${esc(note)}</span>`
  const from = /^from\b/i.test(note)
  const rest = from ? '' : note
  return `${from ? '<span class="from">from</span>' : ''}<span class="amount">$${s.price}</span>${
    rest ? `<span class="save">${esc(rest)}</span>` : ''
  }`
}

export const wordmark = (className = '') => `
  <div class="wordmark ${className}"><span class="sublime">sublime</span><span class="studio">hair studio</span></div>`

/* The squiggle under an accent word is an SVG, which can't read a variable, so each colour has its own. */
const squiggle = (hex) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M3 8c9.5-5.3 17.5-5.3 28.5 0s19 5.3 28.5 0 19-5.3 28.5 0 19 5.3 28.5 0' fill='none' stroke='%23${hex}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`

/** The brand tokens and house type (from sites/sublime/theme.yml and foundation/main.js). */
export const baseCss = `
:root {
  --ink: #17120F; --paper: #F6F0E6; --sand: #ECE3D6; --card: #FFFCF6;
  --vermilion: #C8401F; --deep: #B5391B; --bright: #E2582F; --on-verm: #FFF1E8; --on-verm-soft: #F8D3C4;
  --body: #3E352F; --subtle: #6F6259; --rule: #DDD0BE;
  --sans: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  --logo: 'Bodoni Moda', Didot, Georgia, serif;
  --squiggle: ${squiggle('B5391B')};
  --squiggle-bright: ${squiggle('E2582F')};
  --squiggle-ink: ${squiggle('17120F')};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: var(--sans); color: var(--body); background: #888; }
ul { list-style: none; }
.caps, .eyebrow, .from, .tag, .sub {
  font-stretch: 125%; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
}
.wordmark { display: flex; flex-direction: column; align-items: center; line-height: 1; color: var(--ink); }
.wordmark .sublime { font-family: var(--logo); font-style: italic; font-weight: 500; font-size: 30pt; letter-spacing: -0.03em; }
.wordmark .studio { margin-top: 3pt; margin-right: -0.34em; font-size: 6.4pt; font-weight: 600; font-stretch: 125%; letter-spacing: 0.34em; text-transform: uppercase; }
`

const fonts =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Bodoni+Moda:ital,opsz,wght@1,6..96,500&display=block'

export const document = ({ title, css, body }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<link href="${fonts}" rel="stylesheet">
<style>${baseCss}${css}</style></head>
<body>${body}</body></html>`

/* ---------- render ---------- */

/**
 * Print `html` to `out` with headless Chrome. With `--html` on the command
 * line, writes the HTML to a temp file and prints its path instead (for
 * previewing in a browser).
 */
export function renderPdf(html, out) {
  const htmlPath = join(mkdtempSync(join(tmpdir(), 'sublime-print-')), 'page.html')
  writeFileSync(htmlPath, html)
  if (process.argv.includes('--html')) return console.log(htmlPath)
  mkdirSync(dirname(out), { recursive: true })
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
    '--virtual-time-budget=10000', `--print-to-pdf=${out}`, `file://${htmlPath}`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] })
  console.log(`Wrote ${out.replace(root + '/', '')}`)
}
