---
type: Header
nav: authored
ctaHref: /book
ctaMobileLabel: Book an appointment
edge: selvedge
# The Sublime logo, in place of the wordmark set in type: ink on the paper
# bar, paper on the dark one. The bar goes dark on pages that open on a dark
# section, like the homepage hero (`bar: auto`).
logo: /images/sublime-logo-ink.png
logoOnDark: /images/sublime-logo-paper.png
---

<!-- The whole nav, in order: the first half sits left of the wordmark, the
     rest right. The link to /book is drawn as the booking button. The wordmark
     is the home link, so there is no Home here.

     Shop is Bijou Boutique, built as its own site and served under /shop/ on
     this domain (sites/bijou). `{reload}` makes it a full page load — the
     other site's pages aren't routes of this one. -->
[Services](/services)
[Colour](/colour)
[The Crew](/crew)
[Visit](/visit)
[Shop](/shop/){reload}
[Book now](/book)

<!-- The floating palette picker, for trying the site in another colour. The
     first is the house vermilion (theme.yml). Delete this block to remove the
     picker. -->
```yaml:palettes
- { id: vermilion, name: Vermilion, color: '#C8401F', bright: '#E2582F', deep: '#B5391B' }
- { id: espresso, name: Dark brown, color: '#4A2E22', bright: '#C09274', deep: '#4A2E22', pop: '#E3C9A8' }
- { id: gold, name: Gold, color: '#8C6420', bright: '#D9B25E', deep: '#7A5818', pop: '#F3E2B3' }
- { id: silver, name: Silver, color: '#6B6E73', bright: '#C4C7CB', deep: '#55585D', pop: '#E4E6E9' }
```
