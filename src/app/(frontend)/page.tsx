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
  title: `Venta de Orquídeas en Ituzaingó y Zona Oeste GBA | ${SITE_NAME}`,
  description: SITE_SEO_DESCRIPTION,
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

    featuredProducts = (productsResult.docs as Product[]).map(mapProductToCard)
    careSheets = (careSheetsResult.docs as CareSheet[]).map(mapCareSheetToCard)
  } catch {
    // MongoDB may be unavailable during initial setup
    featuredProducts = []
    careSheets = []
  }

  // Fotos reales de la colección para el hero y la franja editorial — antes
  // esas secciones no tenían ninguna imagen de planta/flor.
  const heroSheet =
    careSheets.find((sheet) => sheet.slug === 'cattleya') ?? careSheets[0]
  const editorialSheet =
    careSheets.find((sheet) => sheet.slug === 'vanda' && sheet.id !== heroSheet?.id) ??
    careSheets.find((sheet) => sheet.id !== heroSheet?.id) ??
    careSheets[0]

  return (
    <>
      <HeroSection imageUrl={heroSheet?.heroImageUrl} imageAlt={heroSheet?.heroImageAlt} />
      <FeaturedCollection products={featuredProducts} genusHighlights={careSheets} />
      <EditorialStrip imageUrl={editorialSheet?.heroImageUrl} imageAlt={editorialSheet?.heroImageAlt} />
      <CarePreview />
      <NewsletterCTA />
    </>
  )
}
