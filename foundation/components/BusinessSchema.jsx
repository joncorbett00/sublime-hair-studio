import { useWebsite } from '@uniweb/kit'

/**
 * LocalBusiness structured data (schema.org JSON-LD), built from the
 * `business:` block in the site's site.yml. This is how Google ties the
 * website to the Google Business Profile, so the values must match the
 * profile exactly. `business.type` is the schema.org type — HairSalon,
 * ClothingStore — and defaults to LocalBusiness.
 *
 * Renders nothing when a site has no `business:` block.
 */
export default function BusinessSchema() {
  const { website } = useWebsite()
  const b = website.config?.business
  if (!b?.name) return null

  const { address = {}, geo, hours = [], sameAs = [] } = b
  const data = {
    '@context': 'https://schema.org',
    '@type': b.type || 'LocalBusiness',
    '@id': `${b.url}/#business`,
    name: b.name,
    url: b.url,
    telephone: b.telephone,
    email: b.email,
    image: b.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: geo && { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    openingHoursSpecification: hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: sameAs.length ? sameAs : undefined,
  }

  // `<` escaped so nothing in the data can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
