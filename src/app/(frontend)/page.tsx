import type { Metadata } from 'next'

import { CarePreview } from '@/components/home/CarePreview'
import { EditorialStrip } from '@/components/home/EditorialStrip'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { HeroSection } from '@/components/home/HeroSection'
import { NewsletterCTA } from '@/components/home/NewsletterCTA'
import type { CareSheet, Product } from '@/payload-types'
import { mapCareSheetToCard } from '@/lib/content'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'
import {
  PRODUCT_PLACEHOLDER_SRC,
  SITE_NAME,
  SITE_SEO_DESCRIPTION,
  SITE_WATERMARK_SRC,
} from '@/lib/constants'

export const dynamic = 'force-dynamic'

/**
 * Next.js only applies a layout's title.template to CHILD segments
 * (e.g. /catalog) — not to a page.tsx that lives in the same folder as
 * the layout.tsx defining the template. Since this homepage sits right
 * next to `(frontend)/layout.tsx`, the "%s | RESERVA OESTE" template
 * never gets applied here, so the suffix is spelled out directly.
 */
export const metadata: Metadata = {
  title: `Venta de Orquídeas en Ituzaingó y Zona Oeste GBA | ${SITE_NAME}`,
  description: SITE_SEO_DESCRIPTION,
  alternates: {
    languages: { es: '/', en: '/en', fr: '/fr', pt: '/pt' },
  },
}

export default async function HomePage() {
  let featuredProducts: ReturnType<typeof mapProductToCard>[] = []
  let careSheets: ReturnType<typeof mapCareSheetToCard>[] = []

  try {
    const payload = await getPayloadClient()
    const [productsResult, careSheetsResult] = await Promise.all([
      payload.find({
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
      }),
      payload.find({
        collection: 'care-sheets',
        where: { status: { equals: 'published' } },
        limit: 9,
        depth: 1,
        sort: 'title',
      }),
    ])

    // Nunca destacar en la home un producto sin foto cargada.
    featuredProducts = (productsResult.docs as Product[])
      .map(mapProductToCard)
      .filter((product) => product.imageUrl)
    careSheets = (careSheetsResult.docs as CareSheet[]).map(mapCareSheetToCard)
  } catch {
    // MongoDB may be unavailable during initial setup
    featuredProducts = []
    careSheets = []
  }

  return (
    <>
      <HeroSection
        imageUrl={SITE_WATERMARK_SRC}
        imageAlt="Cattleya de la colección Reserva Oeste"
      />
      <FeaturedCollection products={featuredProducts} genusHighlights={careSheets} />
      <EditorialStrip
        imageUrl={PRODUCT_PLACEHOLDER_SRC}
        imageAlt="Orquídeas de la colección en el vivero"
      />
      <CarePreview />
      <NewsletterCTA />
    </>
  )
}
