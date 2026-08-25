import Link from 'next/link'

import { ProductCard, type ProductCardData } from '@/components/products/ProductCard'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getDictionary } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/locales'

type FeaturedCollectionProps = {
  products: ProductCardData[]
  /**
   * Fotos de géneros (fichas de cultivo) para mostrar como vidriera mientras
   * no haya ejemplares marcados como destacados en el catálogo — así la
   * sección nunca queda con solo texto y sin fotos de plantas.
   */
  genusHighlights?: Array<{
    id: string
    slug: string
    title: string
    genus?: string | null
    heroImageUrl?: string | null
    heroImageAlt?: string
  }>
  locale?: Locale
  prefix?: string
}

export function FeaturedCollection({
  products,
  genusHighlights = [],
  locale,
  prefix = '',
}: FeaturedCollectionProps) {
  const t = getDictionary(locale)
  const showProducts = products.length > 0
  const photoHighlights = genusHighlights.filter((sheet) => sheet.heroImageUrl)

  return (
    <section className="relative border-t border-ro-charcoal/8 bg-ro-ivory/75 py-24 backdrop-blur-[2px] md:py-32">
      <div className="ro-container">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          {showProducts ? (
            <SectionHeading
              label={t?.featured.label ?? 'Selección'}
              title={t?.featured.titleProducts ?? 'Ejemplares destacados'}
              description={
                t?.featured.descProducts ??
                'Piezas elegidas de la colección, listas para el coleccionista exigente.'
              }
            />
          ) : (
            <SectionHeading
              label={t?.featured.label ?? 'Selección'}
              title={t?.featured.titleFallback ?? 'Explorá por género'}
              description={
                t?.featured.descFallback ??
                'Orquídeas de colección — Cattleya, Vanda, Phalaenopsis y más — cada una con su propio carácter y su flor.'
              }
            />
          )}
          <Link href={`${prefix}/tienda`} className="ro-link shrink-0 text-ro-gold">
            {t?.featured.viewAll ?? 'Ver todo →'}
          </Link>
        </div>

        {showProducts ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} prefix={prefix} />
            ))}
          </div>
        ) : photoHighlights.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {photoHighlights.slice(0, 8).map((sheet) => (
              <Link key={sheet.id} href={`${prefix}/care/${sheet.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-ro bg-ro-card shadow-sm ring-1 ring-ro-charcoal/5">
                  <MediaImage
                    src={sheet.heroImageUrl as string}
                    alt={sheet.heroImageAlt || sheet.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-4 text-center font-sans text-sm text-ro-charcoal md:text-left">
                  {sheet.genus || sheet.title}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">
            {t ? (
              t.featured.noResults
            ) : (
              <>
                Aún no hay ejemplares destacados. Publicá productos en el{' '}
                <Link href="/admin" className="text-ro-gold underline">
                  panel de administración
                </Link>
                .
              </>
            )}
          </p>
        )}
      </div>
    </section>
  )
}
