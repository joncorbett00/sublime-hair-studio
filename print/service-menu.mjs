/**
 * The printed service menu — two Letter pages in the website's "Front Row" look.
 *
 *   pnpm menu
 *
 * Reads the same `services` records the website shows (sites/sublime/records/
 * services/), the category notes from the services page, and the address and
 * hours from site.yml, so a price changed for the website is changed here by
 * running this again. Writes sites/sublime/public/downloads/sublime-service-menu.pdf,
 * which the services page links to.
 *
 * Needs Google Chrome (set CHROME to its binary if it isn't in the usual place)
 * and a network connection for the Archivo and Bodoni Moda web fonts.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import {
  site, services, byCategory, business, hours, phone, domain,
  esc, price, wordmark, document, renderPdf,
} from './shared.mjs'

const out = join(site, 'public/downloads/sublime-service-menu.pdf')

/* The notes beside each category heading, from the services page's `yaml:categories` block. */
const menuPage = readFileSync(join(site, 'pages/services/1-menu.md'), 'utf8')
const notesBlock = menuPage.match(/```yaml:categories\n([\s\S]*?)```/)
const notes = new Map((notesBlock ? parse(notesBlock[1]) : []).map((c) => [c.name, c.note]))

/* ---------- markup ---------- */

const row = (s, detail) => `
  <li class="row">
    <span class="name">${esc(s.title)}${s.featured ? '<span class="tag">Signature</span>' : ''}${
      detail && s.tagline ? `<span class="detail">${esc(s.tagline)}</span>` : ''
    }</span>
    <span class="dots"></span>
    <span class="price">${price(s)}</span>
  </li>`

const group = (name, { no, title = name, list = byCategory(name), note = notes.get(name), detail = false } = {}) => `
  <section class="group">
    <header>
      <h2>${no ? `<span class="no">${no}</span>` : ''}${esc(title)}</h2>
      ${note ? `<p class="note">${esc(note)}</p>` : ''}
    </header>
    <ul>${list.map((s) => row(s, detail)).join('')}</ul>
  </section>`

const footer = `
  <footer class="foot">
    <div>
      <p class="caps">Visit</p>
      <p>${esc(business.address.street)}, second floor<br>Ottawa, ${business.address.region} ${business.address.postalCode}</p>
    </div>
    <div>
      <p class="caps">Hours</p>
      <p>${hours}<br>Sun &amp; Mon closed</p>
    </div>
    <div>
      <p class="caps">Call</p>
      <p>${phone}<br>${esc(business.email)}</p>
    </div>
    <div class="book">
      <p class="caps">Book online</p>
      <p class="url">${domain}/book</p>
    </div>
  </footer>`

const pkgs = byCategory('Packages')
const blowouts = pkgs.filter((s) => s.price > 0)
const quoted = pkgs.filter((s) => !(s.price > 0))
const [furterer] = services.filter((s) => s.slug === 'rene-furterer-hair-loss')
const massage = byCategory('Scalp Massage')

const page1 = `
<div class="page">
  <div class="stripe"></div>
  <div class="top">
    <p class="eyebrow"><span class="eno">No. 01</span><span class="rule"></span>Service menu</p>
    ${wordmark()}
    <p class="eyebrow right">${domain}</p>
  </div>

  <div class="lede">
    <h1>The focus is<br>on <em>you.</em></h1>
    <div class="intro">
      <p>Every appointment starts with a consultation, and every service includes a wash and a
      rejuvenating scalp massage — updos excepted.</p>
      <p>Prices marked <span class="from">from</span> move with length, density and the work involved.
      You get a firm number at the consult, before anything starts.</p>
    </div>
  </div>

  <div class="cols">
    <div>
      ${group('Cut & Style', { no: '01', title: 'Signature Cut & Style' })}
      ${group('Styling', { no: '02' })}
      ${group('Add-ons', { no: '03' })}
      <section class="group">
        <header><h2><span class="no">04</span>Exclusive Packages</h2></header>
        <p class="sub">Blowouts, prepaid</p>
        <ul>${blowouts.map((s) => row(s)).join('')}</ul>
        <ul class="quoted-list">
          ${quoted.map((s) => `<li><strong>${esc(s.title)}</strong> ${esc(s.tagline || '')}</li>`).join('')}
        </ul>
      </section>
    </div>
    <div>
      ${group('Colour', { no: '05' })}
    </div>
  </div>
  ${footer}
</div>`

const page2 = `
<div class="page">
  <div class="stripe"></div>
  <div class="top">
    <p class="eyebrow"><span class="eno">No. 02</span><span class="rule"></span>Treatments &amp; massage</p>
    ${wordmark()}
    <p class="eyebrow right">${domain}</p>
  </div>

  <div class="lede">
    <h1>Rejuvenation<br>&amp; <em>relaxation.</em></h1>
    <div class="intro">
      <p>Treatments for hair that has been through some things, and scalp massages for the
      person underneath it. Add any of them to your appointment, or book them on their own.</p>
    </div>
  </div>

  ${group('Treatments', { no: '06', detail: true, list: byCategory('Treatments').filter((s) => s !== furterer) })}

  <article class="feature">
    <div>
      <p class="caps">Featured treatment</p>
      <h3>${esc(furterer.title)}</h3>
      <p class="tagline">${esc(furterer.tagline)}</p>
    </div>
    <div>
      <p>${esc(furterer.description)}</p>
      <p class="feature-price">${price(furterer)}</p>
    </div>
  </article>

  <section class="block">
    <header>
      <h2><span class="no">07</span>Scalp Massage</h2>
      <p>All services include a short scalp massage. For a more focused experience, add a longer
      one to your service.</p>
    </header>
    <ul class="minutes">
      ${massage
        .map((s) => `<li><span class="mins">${parseInt(s.title)}</span><span class="unit">minutes</span><span class="amount">$${s.price}</span></li>`)
        .join('')}
    </ul>
  </section>

  <section class="know">
    <h2 class="caps">Good to know</h2>
    <div>
      <p><strong>Consultation first.</strong> We talk it through before anything starts, so the price is never a surprise.</p>
      <p><strong>Colour.</strong> A patch test at least 48 hours ahead. Materials are charged in addition.</p>
      <p><strong>Packages.</strong> Bridal and custom treatment packages are built for you — contact us directly.</p>
    </div>
  </section>
  ${footer}
</div>`

/* ---------- style ---------- */

const css = `
@page { size: letter; margin: 0; }

.page {
  width: 8.5in; height: 11in; position: relative; overflow: hidden;
  background: var(--paper); padding: 0.5in 0.55in 0; display: flex; flex-direction: column;
  page-break-after: always; break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }
.stripe { position: absolute; inset: 0 0 auto 0; height: 0.09in; background: var(--vermilion); }


/* masthead */
.top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.eyebrow { display: flex; align-items: center; gap: 8pt; font-size: 6.5pt; color: var(--ink); }
.eyebrow.right { justify-content: flex-end; letter-spacing: 0.14em; }
.eno { white-space: nowrap; font-style: italic; font-weight: 500; font-size: 10pt; letter-spacing: 0; text-transform: none; font-stretch: 100%; color: var(--deep); }
.rule { width: 22pt; height: 1px; background: var(--deep); }

/* the big line */
.lede {
  display: grid; grid-template-columns: 1.05fr 1fr; gap: 0.4in; align-items: end;
  margin-top: 0.28in; padding-bottom: 0.18in; border-bottom: 1.5px solid var(--ink);
}
h1 { font-size: 34pt; font-weight: 500; line-height: 0.98; letter-spacing: -0.035em; color: var(--ink); }
h1 em {
  font-style: italic; color: var(--deep); padding-bottom: 0.1em;
  background: var(--squiggle) no-repeat left bottom / 100% 0.2em;
}
.intro p { font-size: 8.4pt; line-height: 1.5; }
.intro p + p { margin-top: 5pt; }
.intro .from { font-size: 6pt; color: var(--subtle); }

/* price lists */
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.42in; margin-top: 0.2in; flex: 1; }
.group + .group { margin-top: 0.2in; }
.detail { margin-left: 7pt; font-size: 8pt; font-style: italic; color: var(--subtle); }
.group header { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; border-bottom: 1px solid var(--ink); padding-bottom: 3.5pt; }
.group h2 { font-size: 14.5pt; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); display: flex; align-items: baseline; gap: 6pt; }
.no { font-size: 9pt; font-style: italic; font-weight: 500; color: var(--deep); letter-spacing: 0; }
.group .note { font-size: 7.6pt; font-style: italic; color: var(--deep); text-align: right; }
.row { display: flex; align-items: baseline; gap: 5pt; padding: 3.9pt 0; border-bottom: 0.5px solid var(--rule); font-size: 9.4pt; color: var(--ink); }
.row .name { flex: 0 1 auto; }
.row .dots { flex: 1; }
.row .price { flex: none; display: flex; align-items: baseline; gap: 4pt; white-space: nowrap; }
.from { font-size: 5.6pt; color: var(--subtle); }
.amount { font-weight: 600; font-size: 10pt; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.save { font-size: 7pt; font-style: italic; color: var(--deep); }
.quoted { font-size: 8.5pt; font-style: italic; color: var(--deep); }
.tag { margin-left: 5pt; background: var(--ink); color: var(--paper); font-size: 4.6pt; padding: 1.6pt 3.2pt; vertical-align: 1.5pt; }
.sub { font-size: 6pt; color: var(--subtle); margin-top: 6pt; }
.quoted-list { margin-top: 7pt; }
.quoted-list li { font-size: 8pt; line-height: 1.4; }
.quoted-list li + li { margin-top: 4pt; }
.quoted-list strong { color: var(--ink); font-weight: 600; }

/* page 2 */
.page > .group { margin-top: 0.24in; }
.page > .group .row { font-size: 10.5pt; padding: 5pt 0; }
.page > .group .amount { font-size: 11.5pt; }
.feature {
  margin-top: 0.2in; background: var(--sand); padding: 0.2in 0.24in;
  display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 0.3in; border-left: 3pt solid var(--vermilion);
}
.feature .caps { font-size: 5.8pt; color: var(--subtle); }
.feature h3 { margin-top: 6pt; font-size: 16pt; font-weight: 600; line-height: 1.05; letter-spacing: -0.02em; color: var(--ink); }
.feature .tagline { margin-top: 6pt; font-size: 9pt; font-style: italic; color: var(--deep); line-height: 1.35; }
.feature p { font-size: 8.4pt; line-height: 1.55; }
.feature-price { margin-top: 8pt; display: flex; align-items: baseline; gap: 5pt; color: var(--ink); }
.feature-price .amount { font-size: 18pt; }

.block { margin-top: 0.22in; background: var(--vermilion); color: var(--on-verm); padding: 0.24in 0.28in 0.26in; }
.block header { display: grid; grid-template-columns: auto 1fr; gap: 0.35in; align-items: end; }
.block h2 { font-size: 22pt; font-weight: 600; letter-spacing: -0.03em; color: var(--paper); display: flex; align-items: baseline; gap: 7pt; line-height: 1; }
.block .no { color: var(--ink); font-size: 11pt; }
.block header p { font-size: 8.4pt; line-height: 1.5; color: var(--on-verm); }
.minutes { margin-top: 0.2in; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(246,240,230,.4); }
.minutes li { display: flex; flex-direction: column; padding: 10pt 0 0 12pt; border-left: 1px solid rgba(246,240,230,.4); }
.minutes li:first-child { border-left: 0; padding-left: 0; }
.minutes .mins { font-size: 34pt; font-weight: 500; letter-spacing: -0.04em; line-height: 1; color: var(--paper); }
.minutes .unit { font-size: 5.8pt; font-weight: 600; font-stretch: 125%; letter-spacing: .18em; text-transform: uppercase; color: var(--on-verm-soft); margin-top: 3pt; }
.minutes .amount { margin-top: 9pt; font-size: 14pt; color: var(--ink); }

.know { margin-top: 0.22in; flex: 1; }
.know h2 { font-size: 6.5pt; color: var(--ink); padding-bottom: 5pt; border-bottom: 1px solid var(--ink); }
.know div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25in; margin-top: 8pt; }
.know p { font-size: 8pt; line-height: 1.5; }
.know strong { color: var(--ink); font-weight: 600; }

/* footer, on ink */
.foot {
  margin: 0 -0.55in; padding: 0.17in 0.55in 0.2in; background: var(--ink); color: #D9CEC2;
  display: grid; grid-template-columns: 1.15fr 1.1fr 1fr 1fr; gap: 0.22in;
}
.foot .caps { font-size: 5.4pt; color: #A89A8E; margin-bottom: 3pt; }
.foot p { font-size: 7.6pt; line-height: 1.45; }
.foot .book .url { font-size: 10pt; font-weight: 600; color: #E2582F; }
@media screen { .page { margin: 0.3in auto; box-shadow: 0 2px 20px rgba(0,0,0,.25); } }
`

renderPdf(document({ title: 'Sublime Hair Studio — Service Menu', css, body: page1 + page2 }), out)
