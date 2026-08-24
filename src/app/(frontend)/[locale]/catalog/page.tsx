import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'

import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; difficulty?: string; category?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isSupportedLocale(locale)) return {}
  const t = getDictionary(locale as Locale)
  return {
    title: t?.catalog.title,
    description: t?.catalog.desc,
    alternates: {
      canonical: `/${locale}/catalog`,
      languages: { es: '/catalog', en: '/en/catalog', fr: '/fr/catalog', pt: '/pt/catalog' },
    },
  }
}

export default async function LocaleCatalogPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`
  const t = getDictionary(locale as Locale)!

  const sp = await searchParams
  const payload = await getPayloadClient()

  const and: Where[] = [{ status: { equals: 'published' } }]
  if (sp.q) {
    and.push({
      or: [
        { name: { contains: sp.q } },
        { species: { contains: sp.q } },
        { hybrid: { contains: sp.q } },
      ],
    })
  }
  if (sp.difficulty) and.push({ difficulty: { equals: sp.difficulty } })
  if (sp.category) and.push({ 'categories.slug': { equals: sp.category } })

  const { docs } = await payload.find({
    collection: 'products',
    where: { and },
    limit: 48,
    depth: 2,
    sort: 'name',
  })

  const products = (docs as Product[]).map(mapProductToCard).filter((product) => product.imageUrl)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.catalog.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label={t.catalog.badge}
          title={t.catalog.title}
          description={t.catalog.desc}
          className="mb-12"
        />

        <form
          method="get"
          className="mb-16 flex flex-col gap-4 rounded-ro border border-ro-charcoal/10 bg-ro-card p-6 md:flex-row md:items-end"
        >
          <label className="flex-1">
            <span className="ro-label mb-2 block">{t.catalog.searchLabel}</span>
            <input
              name="q"
              defaultValue={sp.q}
              placeholder={t.catalog.searchPlaceholder}
              className="w-full rounded-ro border border-ro-charcoal/15 bg-ro-ivory px-4 py-3 font-sans text-sm text-ro-charcoal placeholder:text-ro-muted focus:border-ro-gold focus:outline-none"
            />
          </label>
          <label>
            <span className="ro-label mb-2 block">{t.catalog.difficultyLabel}</span>
            <select
              name="difficulty"
              defaultValue={sp.difficulty}
              className="w-full rounded-ro border border-ro-charcoal/15 bg-ro-ivory px-4 py-3 font-sans text-sm text-ro-charcoal focus:border-ro-gold focus:outline-none md:w-48"
            >
              <option value="">{t.catalog.difficultyAll}</option>
              <option value="beginner">{t.catalog.diffBeginner}</option>
              <option value="intermediate">{t.catalog.diffIntermediate}</option>
              <option value="advanced">{t.catalog.diffAdvanced}</option>
              <option value="expert">{t.catalog.diffExpert}</option>
            </select>
          </label>
          <button type="submit" className="ro-button md:mb-0">
            {t.catalog.filterBtn}
          </button>
        </form>

        {products.length > 0 ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale as Locale}
                prefix={prefix}
              />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">{t.catalog.noResults}</p>
        )}

        <div className="mt-24 max-w-2xl border-t border-ro-charcoal/10 pt-16">
          <p className="ro-label mb-4 text-ro-gold">{t.catalog.faqLabel}</p>
          <h2 className="ro-heading text-3xl md:text-4xl">{t.catalog.faqTitle}</h2>
          <dl className="mt-10 space-y-8">
            {t.catalog.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-sans text-sm font-medium text-ro-charcoal md:text-base">
                  {faq.question}
                </dt>
                <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-ro-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}
