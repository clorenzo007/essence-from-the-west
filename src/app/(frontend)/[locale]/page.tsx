import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CarePreview } from '@/components/home/CarePreview'
import { EditorialStrip } from '@/components/home/EditorialStrip'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { HeroSection } from '@/components/home/HeroSection'
import { NewsletterCTA } from '@/components/home/NewsletterCTA'
import type { CareSheet, Product } from '@/payload-types'
import { mapCareSheetToCard } from '@/lib/content'
import { getDisplayCurrency } from '@/lib/currency'
import { getBnaUsdRate } from '@/lib/exchange-rate'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'
import {
  PRODUCT_PLACEHOLDER_SRC,
  SITE_NAME,
  SITE_SEO_DESCRIPTION,
  SITE_WATERMARK_SRC,
} from '@/lib/constants'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isSupportedLocale(locale)) return {}
  const t = getDictionary(locale as Locale)
  return {
    title: `${t?.hero.title1} ${t?.hero.title2} | ${SITE_NAME}`,
    description: t?.hero.subtitle ?? SITE_SEO_DESCRIPTION,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/',
        en: '/en',
        fr: '/fr',
        pt: '/pt',
      },
    },
  }
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`

  let featuredProducts: ReturnType<typeof mapProductToCard>[] = []
  let careSheets: ReturnType<typeof mapCareSheetToCard>[] = []
  const [displayCurrency, { venta: usdRate }] = await Promise.all([
    getDisplayCurrency(),
    getBnaUsdRate(),
  ])

  try {
    const payload = await getPayloadClient()
    const [productsResult, careSheetsResult] = await Promise.all([
      payload.find({
        collection: 'products',
        where: {
          and: [{ featured: { equals: true } }, { status: { equals: 'published' } }],
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

    featuredProducts = (productsResult.docs as Product[])
      .map(mapProductToCard)
      .filter((product) => product.imageUrl)
    careSheets = (careSheetsResult.docs as CareSheet[]).map(mapCareSheetToCard)
  } catch {
    featuredProducts = []
    careSheets = []
  }

  return (
    <>
      <HeroSection
        imageUrl={SITE_WATERMARK_SRC}
        imageAlt="Cattleya de la colección Reserva Oeste"
        locale={locale as Locale}
        prefix={prefix}
      />
      <FeaturedCollection
        products={featuredProducts}
        genusHighlights={careSheets}
        locale={locale as Locale}
        prefix={prefix}
        displayCurrency={displayCurrency}
        usdRate={usdRate}
      />
      <EditorialStrip
        imageUrl={PRODUCT_PLACEHOLDER_SRC}
        imageAlt="Orquídeas de la colección en el vivero"
        locale={locale as Locale}
        prefix={prefix}
      />
      <CarePreview locale={locale as Locale} prefix={prefix} />
      <NewsletterCTA locale={locale as Locale} prefix={prefix} />
    </>
  )
}
