import { CarePreview } from '@/components/home/CarePreview'
import { EditorialStrip } from '@/components/home/EditorialStrip'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { HeroSection } from '@/components/home/HeroSection'
import { NewsletterCTA } from '@/components/home/NewsletterCTA'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

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
