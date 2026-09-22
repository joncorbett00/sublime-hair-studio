# sublime-hair-studio — Sublime Hair Studio, "Front Row" look

A [Uniweb](https://github.com/uniweb) site for Sublime Hair Studio. Same pages,
collections and copy as `~/dev/clients/hair-salon-1` (`sites/salon`). The brief was
hair-salon-1, elevated: its fun and colour with some haute fashion in it. The polish comes
from hair-salon-2's editorial look.

The workspace also holds **Bijou Boutique** (the shop), a second site on the same
foundation. For now it is served under `/shop/` on this site's domain.

```
foundation/      section types (React + Tailwind v4), shared by both sites
sites/sublime/   Sublime Hair Studio: pages, records, layout, theme
sites/bijou/     Bijou Boutique: pages, records (finds), layout, theme
scripts/         build.mjs (both sites → one deploy), postbuild.mjs, new-piece.mjs
print/           printable service menu and flyers (PDF)
```

```bash
pnpm install
pnpm dev          # Sublime (the Claude preview uses 5200)
pnpm dev:shop     # Bijou Boutique on its own (the Claude preview uses 5211)
pnpm build        # foundation + both sites → sites/sublime/dist, the shop at dist/shop/
pnpm new-piece "Camel wrap coat"   # a new find for the shop
```

### One foundation, two looks

Both sites use the same section types; each site's look is settings:

| | Sublime ("Front Row") | Bijou ("Wardrobe Department") |
|---|---|---|
| Colours | foundation defaults (vermilion) | `vars:` in `sites/bijou/theme.yml` (jewel green, champagne) |
| Edge along the top | Header/Footer `edge: selvedge` | `edge: filmstrip` |
| Hero | `frame: arch`, `captionLabel: Look 01`, `seal: ring` | `frame: gate`, `inset: polaroid`, `captionLabel: Take 01`, `seal: reel` |
| Split content | `frame: rounded`/`arch`, caption `Fig.` | `frame: gate`, `captionLabel: Still` |
| Header button | `ctaHref: /book` | `ctaHref: /visit`, plus `returnLabel`/`returnHref` back to Sublime |
| Structured data | `business.type: HairSalon` | `business.type: ClothingStore` |

The colour block is `tone: brand` on both (it was `vermilion` here and `jewel` there). The
wordmark and the seal's initial come from the site name; the palette picker's swatches are
a `yaml:palettes` block in each `layout/header.md`.

Links between the two sites end in `{reload}` so they load the other site in full:
`[Shop](/shop/){reload}` here, and `/../` back up from the shop.

---

## The looks side by side

| | hair-salon-1 "one flight up" | hair-salon-2 "Golden Triangle" | **"Front Row"** |
|---|---|---|---|
| Mood | Warm, lamp-lit, a bit funky | Upscale, urban, editorial | A fashion magazine that runs a colourful salon |
| Palette | Cream, espresso, vermilion, marigold | Gallery white, near-black, gold | **One colour, vermilion**, set as whole sections, on paper, sand, taupe and ink |
| Headings | Fraunces (soft serif) | Playfair Display | Archivo at poster sizes; Bodoni Moda italic for the wordmark only |
| Labels | Small bold caps | Tracked uppercase | Wide (125%) tracked Archivo capitals |
| Accent word | Italic + marigold squiggle | Italic, softened | Archivo italic in vermilion + a fine squiggle |
| Shapes | Rounded, arches, ink wink | Square, gold bracket | Square corners, matted photos and arches, no hard shadows |

**Where the clash is:** the magazine side is the Bodoni wordmark, poster-sized headlines, wide capitals, numbered
sections ("No. 03"), figure captions ("Fig. / Look 01"), matted photographs with a second
hairline around the mount, crop marks on the closing CTA, and the wordmark set across the
full width of the footer. The salon side is vermilion as whole sections, the squiggle, the
overlapping hero photos, the turning vermilion seal, and the coupon-style promo band.

### Pages

Home, Services, **Colour**, The Crew, Visit, and Book (a redirect). Colour replaced
hair-salon-1's Weddings page: an intro, how a colour day runs, the colour menu with photos,
colour work, colour reviews, colour FAQ and a CTA. The crew page adds **Sonia's career
timeline** (`Timeline` section) between the team and the hiring note.

### House vocabulary (`foundation/styles.css`)

- `tone: brand | ink | sand` in a section's frontmatter sets the whole section in that
  colour (`.tone-*` redefines every token, so buttons, text and the accent word all adapt).
  Supported by CTA, Promo, SplitContent, Itinerary, Timeline, ServiceMenu, Gallery,
  Testimonials, FAQ, Crew and Visit. `theme: light | medium | dark` still works as usual;
  medium is sand.
- `[words]{accent}` in a heading: italic with a fine squiggle. Vermilion on paper and
  sand, a brighter vermilion on ink, ink on vermilion.
- `.eyebrow` is the section number, a rule and the label. The number is the section's
  position on its page (`components/Shout.jsx`).
- `.btn .btn-primary | outline | ink`: square wide-caps buttons with no shadow. `primary`
  has a hairline rule just inside its edge. All of them fill from the left on hover
  (`--sweep`, `--sweep-ink`). Icons are held to the text height, so pairs line up.
- `.mat` (+ `.arch`): a matted photograph with a long soft shadow. `.halo`: the second
  hairline drawn around a mount on the same centre.
- `.framed` (+ `.laid`, `.lift`): hairline card with the label rule inside. `.laid` is a long
  soft shadow, `.lift` rises on hover.
- `.caps`, `.figcap`, `.running` (vertical caption), `.selvedge` (the vermilion stripe),
  `.nav-line`, `.text-cta`, `.arch`.

**Contrast:** accent words on paper and sand use `--accent-ink` (`#B5391B`, a deeper
vermilion). On ink they use `--vermilion-bright` (`#E2582F`).

### Content changes from hair-salon-1

Beyond the new Colour page and timeline, frontmatter only:

- **Home:** the ticker became a Promo band (back to school, 10% off). Lunch hour is
  `theme: medium` (sand), with its card on paper rather than white.
  The gallery is `layout: carousel` (one scrolling row of 10), and the reviews heading is
  one line. Services use `layout: cards` with the first card in vermilion. The CTA is
  `tone: vermilion`.
- **Other CTAs:** services `ink`, visit `ink`.
- **Header:** `layout/header.md` lost the `# Sublime` title, because the wordmark is set in
  the component. Weddings became Colour in the nav and footer.
- **Footer:** `credit:` and `creditHref:` in `layout/footer.md` are the "Created by Proximify Studios"
  line and its link to proximify.ca.

---

## ⚠️ Before it goes live

Everything in hair-salon-1's README still applies. In particular:

- **Booking link:** `site/pages/book/page.yml` → `redirect:` (Square Appointments).
- **Invented content:** crew (`collections/crew`), prices (`collections/services`),
  reviews (`collections/reviews`).
- **Photos:** most gallery, crew and section photos are hot-linked Unsplash stand-ins. Only
  the four `.jpg` files in `site/public/images/gallery/` are local.
- **`site/public/images/og-default.png` and `logo.png`** are still the hair-salon-1 look.
- **Fonts** are Google Fonts: Archivo for everything you read, and Bodoni Moda (italic, one
  weight) for the wordmark and seal only (`.font-logo`, `--font-logo` in `styles.css`). To
  change the headline face, edit both `fonts:` in `site/theme.yml` and `font-display` in
  `foundation/main.js`.
- **Shop links** in the header and footer point at `shop.sublimehair.ca`, the separate
  shop site in hair-salon-1. It has not been restyled.
- **Sonia's timeline is a placeholder**: every year, headline and photo in
  `site/pages/crew/2-sonia.md`. The photos are stock shots of the kind of work, not of Sonia.
  Replace them with her real history and photos from her career.
- **Colour page placeholders:** the colour-day running order (`pages/colour/2-day.md`), and
  the aftercare and deposit answers (`pages/colour/6-faq.md`).
- **Promo terms:** confirm which services the 10% covers, when it ends and how it is
  redeemed (`pages/home/2-promo.md`). Add `note:` for an end date, and delete the file when
  the offer is over.

## Editing

| To change | Where |
|---|---|
| Colours, fonts | `site/theme.yml`, plus the `:root` and `.tone-*` blocks in `foundation/styles.css` |
| Header height, widths, section rhythm | `foundation/main.js` vars |
| Which sections are colour blocks | `tone:` in each `site/pages/<page>/*.md` |
| Header nav | `site/layout/header.md` |
| Footer blurb, hours, link columns | `site/layout/footer.md` |
| Opening hours | `yaml:hours` in `site/layout/footer.md` and `site/pages/visit/1-visit.md`, plus `business.hours` in `site/site.yml` |
| Hero seal text | `stamp:` in `site/pages/home/1-hero.md` and `site/pages/colour/1-intro.md` |
| The current offer | `site/pages/home/2-promo.md` |
| Sonia's career | `site/pages/crew/2-sonia.md` |
| Footer credit | `credit:` / `creditHref:` in `site/layout/footer.md` |
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
- **`fetcher: supports: [where, limit, sort]` in `site/site.yml` is load-bearing.** Without
  it this runtime filters a collection before caching it, under a key that ignores the
  filter. Whichever page loaded first then decided what the next page got: after the Colour
  page, the homepage's three cards showed the five colour services. Keep it while more than
  one page filters the same collection.
- **The house classes live in `@layer components`** (`styles.css`), so a Tailwind utility on
  the same element wins. Unlayered, `.mat`'s `position: relative` beat `absolute` and the
  hero's second photo stopped overlapping the first.
- **tailwind-merge drops a `leading-*` that comes before a `text-[size]`** in the same
  `cn()`. Put the size first (see `components/Shout.jsx`).
