/**
 * Put a new find on the website:
 *
 *   pnpm new-piece "Camel wrap coat"
 *
 * Writes sites/bijou/records/piece/camel-wrap-coat.md with today's date as `added`,
 * so it shows first among the finds, marked "Just in" — and the oldest find
 * comes off the website. Fill in the fields, add the photo, and it is live on
 * the next build.
 *
 * Not ready to put it out yet? Pass --staged and the file is written as
 * _camel-wrap-coat.md: a leading underscore keeps it out of the records until
 * you rename it.
 */
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const staged = args.includes('--staged')
const title = args.filter((a) => !a.startsWith('--')).join(' ').trim()

if (!title) {
  console.error('Usage: pnpm new-piece "Camel wrap coat" [--staged]')
  process.exit(1)
}

const slug = title
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const dir = new URL('../sites/bijou/records/piece/', import.meta.url).pathname
const file = join(dir, `${staged ? '_' : ''}${slug}.md`)

if (existsSync(join(dir, `${slug}.md`)) || existsSync(join(dir, `_${slug}.md`))) {
  console.error(`A piece called "${slug}" already exists in sites/bijou/records/piece/. Pick another title.`)
  process.exit(1)
}

// The local date, not UTC: a piece added in the evening in Montréal is today's.
const d = new Date()
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

writeFileSync(file, `---
title: ${title}
added: ${today}
production: ""
year:
worn:
scene:
doubled:
category: Outerwear   # Outerwear, Dresses, Suiting, Tops, Knitwear or Accessories
era:
material:
size: ""
price:
condition:
image:                # the main photo, portrait (4:5) — a URL, or ./${slug}.jpg beside this file
description: >-
  One line for the card and for search results.
---

The story of the piece: why it was chosen, what was altered, what happened to it on set.
`)

console.log(`Wrote ${file.replace(new URL('..', import.meta.url).pathname, '')}${staged ? ' (staged — rename without the _ to put it on the website)' : ''}`)
