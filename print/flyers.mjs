/**
 * Handout flyers — half-letter (5.5 × 8.5 in), in the website's look.
 *
 *   pnpm flyers
 *
 * Three designs, each with a QR code that opens the Square booking site:
 *
 *   1. The focus is on you   vermilion, for handing out on the street
 *   2. Hello, neighbour      paper, for sliding under office doors nearby
 *   3. Bring us a photo      ink, colour work
 *
 * Writes two PDFs to print/out/:
 *
 *   sublime-flyers-print-shop.pdf  one flyer per page at 5.75 × 8.75 in — the
 *                                  flyer plus a 0.125 in bleed, which is what a
 *                                  print shop asks for. Trims to 5.5 × 8.5.
 *   sublime-flyers-2-up.pdf        two of the same flyer on a Letter sheet, for
 *                                  an office printer. Cut down the middle.
 *
 * Prices, address and hours come from the site (see shared.mjs), so run this
 * again after a price change.
 */
import { join } from 'node:path'
import QRCode from 'qrcode'
import {
  root, service, business, booking, hours, phone, domain,
  esc, price, wordmark, document, renderPdf,
} from './shared.mjs'

const outDir = join(root, 'print/out')

/* The QR goes straight to Square rather than the site's /book redirect, so it
   works whatever the website's domain is doing. */
const qr = await QRCode.toString(booking.services, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#17120F', light: '#0000' },
})

/* ---------- pieces ---------- */

const priceRow = (slug, label) => {
  const s = service(slug)
  return `<li class="row"><span class="name">${esc(label || s.title)}</span><span class="dots"></span><span class="price">${price(s)}</span></li>`
}

const bookBlock = (line = 'Scan to book') => `
  <div class="book">
    <div class="qr">${qr}</div>
    <div>
      <p class="caps">${esc(line)}</p>
      <p class="url">${domain}/book</p>
      <p class="small">Or call ${phone}</p>
    </div>
  </div>`

const address = `
  <div class="where">
    <p><strong>${esc(business.address.street)}</strong>, second floor<br>just off Elgin · Ottawa</p>
    <p><strong>${hours}</strong><br>Sun &amp; Mon closed</p>
  </div>`

/* ---------- the three flyers ---------- */

const street = `
<div class="flyer verm">
  <div class="head">${wordmark()}<p class="eyebrow">Ottawa · Golden Triangle</p></div>
  <h1>The focus<br>is on <em>you.</em></h1>
  <p class="lede">A warm little hair studio upstairs, just off Elgin. Cuts, colour, blowouts,
  updos and treatments — every service with a wash and a scalp massage.</p>
  <ul class="grid">
    <li><span class="caps">Haircuts</span><span class="p">${price(service('classic-haircut'))}</span></li>
    <li><span class="caps">Blowouts</span><span class="p">${price(service('blowout'))}</span></li>
    <li><span class="caps">Colour</span><span class="p">${price(service('colour-touch-up'))}</span></li>
    <li><span class="caps">Balayage</span><span class="p">${price(service('accent-balayage'))}</span></li>
  </ul>
  <p class="consult">Not sure what you want? Start with a <strong>free 15-minute consultation.</strong></p>
  <div class="bottom">${bookBlock()}${address}</div>
</div>`

const office = `
<div class="flyer paper">
  <div class="head">${wordmark()}<p class="eyebrow"><span class="eno">No. 190</span><span class="rule"></span>MacLaren St</p></div>
  <h1>Hello,<br><em>neighbour.</em></h1>
  <p class="lede">We're the hair studio upstairs at ${esc(business.address.street)}, just off Elgin.
  Open ${hours} — and you can book online from your desk.</p>
  <ul class="list">
    ${priceRow('classic-haircut')}
    ${priceRow('technical-haircut')}
    ${priceRow('barber-scissor-cut')}
    ${priceRow('blowout')}
    ${priceRow('colour-touch-up')}
    ${priceRow('full-highlights')}
    ${priceRow('olaplex', 'Olaplex Treatment')}
    ${priceRow('scalp-massage-20')}
  </ul>
  <div class="band">
    <p class="caps">Not sure what you want?</p>
    <p>Book a <strong>free 15-minute consultation</strong> first. Bring a photo.</p>
  </div>
  <div class="bottom">${bookBlock()}${address}</div>
</div>`

const colour = `
<div class="flyer ink">
  <div class="head">${wordmark()}<p class="eyebrow">Colour studio · Ottawa</p></div>
  <p class="kicker caps">Bring us a photo</p>
  <h1>Yes, even<br><em>that one.</em></h1>
  <p class="lede">Screenshots, Pinterest boards, the ones you hate too. From a root touch-up to
  a full vivid, it starts with a consultation — and a firm price before anything begins.</p>
  <ul class="list">
    ${priceRow('colour-touch-up')}
    ${priceRow('shadow-root')}
    ${priceRow('creative-colour')}
    ${priceRow('full-highlights')}
    ${priceRow('accent-balayage')}
    ${priceRow('colour-correction')}
  </ul>
  <p class="fine">Materials are charged in addition. Patch test at least 48 hours ahead.</p>
  <div class="bottom">${bookBlock()}${address}</div>
</div>`

const flyers = [street, office, colour]

/* ---------- style ---------- */

const css = `
.flyer {
  --pad: calc(0.36in + var(--bleed));
  width: calc(5.5in + 2 * var(--bleed)); height: calc(8.5in + 2 * var(--bleed));
  padding: var(--pad); padding-top: calc(var(--pad) + 0.06in);
  position: relative; overflow: hidden; display: flex; flex-direction: column;
  background: var(--bg); color: var(--fg);
}
.flyer::before { content: ''; position: absolute; inset: 0 0 auto 0; height: calc(0.08in + var(--bleed)); background: var(--stripe); }

.verm  { --bg: var(--vermilion); --fg: var(--on-verm); --head: var(--paper); --soft: var(--on-verm-soft); --acc: var(--ink); --sq: var(--squiggle-ink); --line: rgba(246,240,230,.45); --stripe: var(--ink); }
.paper { --bg: var(--paper); --fg: var(--body); --head: var(--ink); --soft: var(--subtle); --acc: var(--deep); --sq: var(--squiggle); --line: var(--rule); --stripe: var(--vermilion); }
.ink   { --bg: var(--ink); --fg: #D9CEC2; --head: var(--paper); --soft: #A89A8E; --acc: var(--bright); --sq: var(--squiggle-bright); --line: #3B312B; --stripe: var(--vermilion); }

.head { display: flex; justify-content: space-between; align-items: center; }
.flyer .wordmark { color: var(--head); align-items: flex-start; }
.flyer .wordmark .sublime { font-size: 25pt; }
.flyer .wordmark .studio { font-size: 5.3pt; }
.eyebrow { display: flex; align-items: center; gap: 6pt; font-size: 5.6pt; color: var(--head); }
.eno { font-style: italic; font-weight: 500; font-size: 9pt; letter-spacing: 0; text-transform: none; font-stretch: 100%; color: var(--acc); }
.rule { width: 16pt; height: 1px; background: var(--acc); }

.kicker { margin-top: 0.36in; font-size: 6.4pt; color: var(--acc); }
h1 {
  margin-top: 0.34in; font-size: 44pt; font-weight: 500; line-height: 0.95; letter-spacing: -0.04em; color: var(--head);
}
.kicker + h1 { margin-top: 0.1in; }
h1 em { font-style: italic; color: var(--acc); padding-bottom: 0.08em; background: var(--sq) no-repeat left bottom / 100% 0.18em; }
.lede { margin-top: 0.2in; font-size: 9.6pt; line-height: 1.5; max-width: 4.2in; }

/* bigger type where the flyer has fewer lines */
.verm h1 { font-size: 58pt; }
.ink h1 { font-size: 54pt; }
.ink .row, .paper .row { padding: 5.4pt 0; font-size: 10.2pt; }
.ink .row .amount, .paper .row .amount { font-size: 10.8pt; }
.consult { margin-top: 0.22in; font-size: 13pt; font-style: italic; line-height: 1.3; color: var(--head); letter-spacing: -0.01em; }
.consult strong { font-weight: 600; }

/* four big prices, street flyer */
.grid { margin-top: 0.3in; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.grid li { padding: 10pt 0 11pt; border-bottom: 1px solid var(--line); display: flex; flex-direction: column; gap: 3pt; }
.grid li:nth-child(even) { padding-left: 14pt; border-left: 1px solid var(--line); }
.grid .caps { font-size: 5.8pt; color: var(--soft); margin-bottom: 2pt; }
.grid .p { display: flex; align-items: baseline; gap: 5pt; }
.grid .from { font-size: 5.4pt; color: var(--soft); }
.grid .amount { font-size: 30pt; font-weight: 500; letter-spacing: -0.03em; color: var(--head); }

/* price list */
.list { margin-top: 0.22in; border-top: 1px solid var(--head); }
.row { display: flex; align-items: baseline; gap: 5pt; padding: 4.4pt 0; border-bottom: 0.5px solid var(--line); font-size: 9.6pt; color: var(--head); }
.row .dots { flex: 1; }
.row .price { display: flex; align-items: baseline; gap: 4pt; white-space: nowrap; }
.row .from { font-size: 5.4pt; color: var(--soft); }
.row .amount { font-weight: 600; font-size: 10.2pt; }
.fine { margin-top: 7pt; font-size: 7pt; font-style: italic; color: var(--soft); }

.band { margin-top: 0.2in; background: var(--vermilion); color: var(--on-verm); padding: 9pt 12pt; }
.band .caps { font-size: 5.6pt; color: var(--on-verm-soft); }
.band p + p { margin-top: 3pt; font-size: 9.6pt; }
.band strong { color: var(--paper); font-weight: 600; }

/* booking + address, pinned to the bottom */
.bottom { margin-top: auto; display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.2in; align-items: end; padding-top: 0.18in; border-top: 1px solid var(--line); }
.book { display: flex; gap: 10pt; align-items: center; }
.qr { width: 0.92in; height: 0.92in; flex: none; background: var(--paper); padding: 5pt; }
.qr svg { display: block; width: 100%; height: 100%; }
.book .caps { font-size: 5.6pt; color: var(--soft); }
.book .url { margin-top: 3pt; font-size: 10.5pt; font-weight: 600; color: var(--head); }
.book .small { margin-top: 2pt; font-size: 7.4pt; }
.where p { font-size: 7.2pt; line-height: 1.4; }
.where p + p { margin-top: 5pt; }
.where strong { color: var(--head); font-weight: 600; }
`

/* Print shop: one flyer a page, with bleed. */
const shopCss = `
@page { size: 5.75in 8.75in; margin: 0; }
:root { --bleed: 0.125in; }
.flyer { break-after: page; }
.flyer:last-child { break-after: auto; }
@media screen { .flyer { margin: 0.3in auto; } }
`

/* Office printer: two of a flyer across a landscape Letter sheet, with a cut line. */
const sheetCss = `
@page { size: 11in 8.5in; margin: 0; }
:root { --bleed: 0in; }
.sheet { width: 11in; height: 8.5in; display: flex; position: relative; break-after: page; }
.sheet:last-child { break-after: auto; }
.sheet::after { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; border-left: 1px dashed rgba(0,0,0,.35); }
@media screen { .sheet { margin: 0.3in auto; } }
`

const title = 'Sublime Hair Studio — Flyers'
renderPdf(document({ title, css: css + shopCss, body: flyers.join('') }), join(outDir, 'sublime-flyers-print-shop.pdf'))
renderPdf(
  document({ title, css: css + sheetCss, body: flyers.map((f) => `<div class="sheet">${f}${f}</div>`).join('') }),
  join(outDir, 'sublime-flyers-2-up.pdf'),
)
