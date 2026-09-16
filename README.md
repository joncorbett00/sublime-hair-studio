# sublime-hair-studio — Sublime Hair Studio, "Front Row" look

A [Uniweb](https://github.com/uniweb) site for Sublime Hair Studio. Same pages,
collections and copy as `~/dev/clients/hair-salon-1` (`sites/salon`). The brief was
hair-salon-1, elevated: its fun and colour with some haute fashion in it. The polish comes
from hair-salon-2's editorial look.

```
foundation/    section types (React + Tailwind v4)
site/          content: pages, collections, layout, theme
```

```bash
pnpm install
pnpm dev          # http://localhost:5173 (the Claude preview uses 5200)
pnpm build        # foundation + site → site/dist (static, prerendered)
```

---

## The looks side by side

| | hair-salon-1 "one flight up" | hair-salon-2 "Golden Triangle" | **"Front Row"** |
|---|---|---|---|
| Mood | Warm, lamp-lit, a bit funky | Upscale, urban, editorial | A fashion magazine that runs a colourful salon |
| Palette | Cream, espresso, vermilion, marigold | Gallery white, near-black, gold | Bone paper, ink, and vermilion, marigold, bottle green **as whole sections** |
| Headings | Fraunces (soft serif) | Playfair Display | Bodoni Moda (Didone) at poster sizes, over Archivo |
| Labels | Small bold caps | Tracked uppercase | Wide (125%) tracked Archivo capitals |
| Accent word | Italic + marigold squiggle | Italic, softened | Bodoni italic in vermilion + marigold squiggle |
| Shapes | Rounded, arches, ink wink | Square, gold bracket | Square corners, arches on solid colour blocks, hard offset shadows |

**Where the clash is:** the magazine side is the Didone type, wide capitals, numbered
sections ("No. 03"), figure captions ("Fig. / Look 01"), hairline rules, crop marks on the
closing CTA, and the wordmark set across the full width of the footer. The salon side is the
colour-block sections, the squiggle, the hard offset shadow on the booking button, arched
photos with a solid block of colour behind them, the turning marigold seal and the
three-colour stripe along the top of every page.

### House vocabulary (`foundation/styles.css`)

- `tone: vermilion | green | marigold | ink` in a section's frontmatter sets the whole
  section in that colour (`.tone-*` redefines every token, so buttons, text and the accent
  word all adapt). Supported by CTA, SplitContent, Itinerary, ServiceMenu, Gallery,
  Testimonials, FAQ, Crew and Visit. `theme: light | medium | dark` still works as usual;
  medium is powder blush.
- `[words]{accent}` in a heading: Bodoni italic, vermilion, with the marigold squiggle
  (vermilion squiggle on marigold, none on vermilion).
- `.eyebrow` is the section number, a rule and the label. The number is the section's
  position on its page (`components/Shout.jsx`).
- `.btn .btn-primary | outline | ink`: square wide-caps buttons. `primary` carries the hard
  offset shadow (`--offset`, `--offset-color`).
- `.blocked` (+ `.block-left`, `--block`): a solid colour block set out behind a photo.
- `.framed` (+ `.lift`): hairline card with the hard offset.
- `.caps`, `.figcap`, `.running` (vertical caption), `.selvedge` (the colour stripe),
  `.nav-line`, `.text-cta`, `.arch`.

**Contrast:** marigold is never small text on paper. Accent words on paper and blush use
`--accent-ink` (`#B5391B`, a deeper vermilion). On ink and colour blocks they turn marigold.

### Content changes from hair-salon-1

Frontmatter only, no copy. Ticker `tone: vermilion`. Lunch hour `tone: green`. Home services
`layout: cards` with the first card in vermilion. Shop teaser `tone: marigold`. CTAs are
`tone: vermilion` (home, weddings), `green` (services) and `ink` (visit). The wedding morning
is `tone: marigold`, and the wedding prices use `layout: cards`.
`layout/header.md` lost the `# Sublime` title because the wordmark is set in the component.

---

## ⚠️ Before it goes live

Everything in hair-salon-1's README still applies. In particular:

- **Booking link:** `site/pages/book/page.yml` → `redirect:` (Square Appointments).
- **Invented content:** crew (`collections/crew`), prices (`collections/services`),
  reviews (`collections/reviews`).
- **Photos:** most gallery, crew and section photos are hot-linked Unsplash stand-ins. Only
  the four `.jpg` files in `site/public/images/gallery/` are local.
- **`site/public/images/og-default.png` and `logo.png`** are still the hair-salon-1 look.
- **Fonts** are Google Fonts. To change the display face, edit both `fonts:` in
  `site/theme.yml` and `font-display` in `foundation/main.js`.
- **Shop links** in the header and footer point at `shop.sublimehair.ca`, the separate
  shop site in hair-salon-1. It has not been restyled.
- The wedding morning's times are still placeholders (see the comment in
  `pages/weddings/2-morning.md`).

## Editing

| To change | Where |
|---|---|
| Colours, fonts | `site/theme.yml`, plus the `:root` and `.tone-*` blocks in `foundation/styles.css` |
| Offset shadow, colour-block offset, widths | `foundation/main.js` vars |
| Which sections are colour blocks | `tone:` in each `site/pages/<page>/*.md` |
| Header nav | `site/layout/header.md` |
| Footer blurb, hours, link columns | `site/layout/footer.md` |
| Opening hours | `yaml:hours` in `site/layout/footer.md` and `site/pages/visit/1-visit.md`, plus `business.hours` in `site/site.yml` |
| Hero seal text | `stamp:` in `site/pages/home/1-hero.md` and `site/pages/weddings/1-intro.md` |
| Services, crew, gallery, reviews | `site/collections/*` |
| Page copy | `site/pages/<page>/*.md` |

`AGENTS.md` is the Uniweb framework guide.

### Framework notes carried over

- **`meta.js` param defaults do not reach `params` at runtime** in this CLI version
  (0.28.1), so every section repeats its defaults in the destructure.
- **Changing a var in `foundation/main.js`** needs `pnpm --filter foundation build` and a
  dev-server restart.
- **A section gets one declaratively-bound collection.** `ServiceMenu` binds `services`
  and fetches the gallery by path (`/data/gallery.json`).
- **tailwind-merge drops a `leading-*` that comes before a `text-[size]`** in the same
  `cn()`. Put the size first (see `components/Shout.jsx`).
