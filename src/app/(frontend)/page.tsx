import type { Metadata } from 'next'

import { CarePreview } from '@/components/home/CarePreview'
import { EditorialStrip } from '@/components/home/EditorialStrip'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { HeroSection } from '@/components/home/HeroSection'
import { NewsletterCTA } from '@/components/home/NewsletterCTA'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'
import { SITE_NAME, SITE_SEO_DESCRIPTION } from '@/lib/constants'

export const dynamic = 'force-dynamic'

/**
 * Next.js only applies a layout's title.template to CHILD segments
 * (e.g. /catalog) — not to a page.tsx that lives in the same folder as
 * the layout.tsx defining the template. Since this homepage sits right
 * next to `(frontend)/layout.tsx`, the "%s | RESERVA OESTE" template
 * never gets applied here, so the suffix is spelled out directly.
 */
export const metadata: Metadata = {
  title: `Orquídeas en Ituzaingó, Zona Oeste del Gran Buenos Aires | ${SITE_NAME}`,
  description: SITE_SEO_DESCRIPTION,
}

export default async function HomePage() {
  let featuredProducts: ReturnType<typeof mapProductToCard>[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        and: [
          { featured: { equals: true } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 6,
      depth: 2,
      sort: '-updatedAt',
    })

    featuredProducts = (docs as Product[]).map(mapProductToCard)
  } catch {
    // MongoDB may be unavailable during initial setup
    featuredProducts = []
  }

  return (
    <>
      <HeroSection />
      <FeaturedCollection products={featuredProducts} />
      <EditorialStrip />
      <CarePreview />
      <NewsletterCTA />
    </>
  )
}
