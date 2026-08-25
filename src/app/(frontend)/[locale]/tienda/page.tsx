import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/products/ProductCard'
import { SupplyCard } from '@/components/supplies/SupplyCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product, Supply } from '@/payload-types'
import { TIENDA_CATEGORIES } from '@/lib/constants'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'
import { mapProductToCard } from '@/lib/products'
import { mapSupplyToCard } from '@/lib/supplies'
import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isSupportedLocale(locale)) return {}
  const t = getDictionary(locale as Locale)
  return {
    title: t?.tienda.title,
    description: t?.tienda.desc,
    alternates: {
      canonical: `/${locale}/tienda`,
      languages: { es: '/tienda', en: '/en/tienda', fr: '/fr/tienda', pt: '/pt/tienda' },
    },
  }
}

export default async function LocaleTiendaPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`
  const t = getDictionary(locale as Locale)!

  const { category: rawCategory } = await searchParams
  const category = TIENDA_CATEGORIES.some((c) => c.value === rawCategory) ? rawCategory! : 'orquideas'
  const payload = await getPayloadClient()

  const categoryLabels: Record<string, string> = {
    orquideas: t.tienda.categories.orchids,
    sustratos: t.tienda.categories.substrates,
    fertilizantes: t.tienda.categories.fertilizers,
    pesticidas: t.tienda.categories.pesticides,
    macetas: t.tienda.categories.pots,
    canastas: t.tienda.categories.baskets,
  }

  let products: ReturnType<typeof mapProductToCard>[] = []
  let supplies: ReturnType<typeof mapSupplyToCard>[] = []

  if (category === 'orquideas') {
    const { docs } = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 48,
      depth: 2,
      sort: 'name',
    })
    products = (docs as Product[]).map(mapProductToCard).filter((p) => p.imageUrl)
  } else {
    const { docs } = await payload.find({
      collection: 'supplies',
      where: { and: [{ status: { equals: 'published' } }, { category: { equals: category } }] },
      limit: 48,
      depth: 2,
      sort: 'name',
    })
    supplies = (docs as Supply[]).map(mapSupplyToCard).filter((s) => s.imageUrl)
  }

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label={t.tienda.badge}
          title={t.tienda.title}
          description={t.tienda.desc}
          className="mb-12"
        />

        <nav className="mb-16 flex flex-wrap gap-3" aria-label="Store categories">
          {TIENDA_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`${prefix}/tienda?category=${c.value}`}
              className={cn(
                'rounded-ro border px-5 py-2 font-sans text-xs uppercase tracking-ro transition-colors',
                category === c.value
                  ? 'border-ro-gold bg-ro-gold text-ro-ivory'
                  : 'border-ro-charcoal/15 text-ro-charcoal hover:border-ro-gold',
              )}
            >
              {categoryLabels[c.value] ?? c.label}
            </Link>
          ))}
        </nav>

        {category === 'orquideas' ? (
          <>
            {products.length > 0 ? (
              <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale as Locale} prefix={prefix} />
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-ro-muted">{t.tienda.noResults}</p>
            )}
            <p className="mt-16 font-sans text-sm">
              <Link href={`${prefix}/catalog`} className="ro-link text-ro-gold">
                {t.catalog.searchLabel} →
              </Link>
            </p>
          </>
        ) : supplies.length > 0 ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {supplies.map((supply) => (
              <SupplyCard
                key={supply.id}
                supply={supply}
                whatsappCtaLabel={t.productDetail.whatsappCta}
                availableLabel={t.productDetail.available}
                soldOutLabel={t.productDetail.soldOut}
              />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">{t.tienda.noResults}</p>
        )}
      </div>
    </div>
  )
}
