import {
  LOGO_SRC,
  SITE_AREA_SERVED,
  SITE_COUNTRY,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_REGION,
  SITE_SEO_DESCRIPTION,
  WHATSAPP_NUMBER,
} from '@/lib/constants'
import { getServerURL } from '@/lib/env'

/**
 * schema.org LocalBusiness structured data, rendered site-wide from the
 * frontend layout. This is what tells Google (and any assistant reading
 * the page) that Reserva Oeste is a real local business based in
 * Ituzaingó that serves the Zona Oeste del Gran Buenos Aires — the core
 * signal for showing up in local/"near me" orchid searches, on top of
 * whatever Google Business Profile eventually adds.
 *
 * No street address is published (visits are by appointment only), so
 * this only claims locality/region — still valid schema.org and still a
 * real signal, just weaker than a verified full address would be.
 */
export function LocalBusinessJsonLd() {
  const url = getServerURL()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_NAME,
    description: SITE_SEO_DESCRIPTION,
    url,
    logo: `${url}${LOGO_SRC}`,
    image: `${url}${LOGO_SRC}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_LOCALITY,
      addressRegion: SITE_REGION,
      addressCountry: SITE_COUNTRY,
    },
    areaServed: {
      '@type': 'Place',
      name: SITE_AREA_SERVED,
    },
    ...(WHATSAPP_NUMBER ? { telephone: WHATSAPP_NUMBER } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
