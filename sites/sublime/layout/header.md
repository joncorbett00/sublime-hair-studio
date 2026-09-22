---
type: Header
nav: authored
ctaHref: /book
ctaMobileLabel: Book an appointment
edge: selvedge
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
- { id: fuchsia, name: Fuchsia, color: '#C21E6A', bright: '#EC5A9A', deep: '#AE1A5F' }
- { id: oxblood, name: Oxblood, color: '#7E1F2A', bright: '#D8606F', deep: '#7E1F2A', pop: '#F4B6BE' }
- { id: plum, name: Plum, color: '#6F2C66', bright: '#C570B7', deep: '#6F2C66', pop: '#EBC0E3' }
- { id: cobalt, name: Cobalt, color: '#2F45C8', bright: '#7389F7', deep: '#2A3EB5', pop: '#C9D2FF' }
- { id: petrol, name: Petrol, color: '#0E6C73', bright: '#3BB4BD', deep: '#0D6168', pop: '#A9E3E7' }
- { id: emerald, name: Emerald, color: '#1E6E50', bright: '#43B78B', deep: '#1B6448', pop: '#B4E6CF' }
```
