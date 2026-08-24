import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'
import { RichTextContent } from '@/components/ui/RichTextContent'

import type { Product } from '@/payload-types'
import { ProductImagePlaceholder } from '@/components/products/ProductImagePlaceholder'
import { WhatsAppCheckoutButton } from '@/components/products/WhatsAppCheckoutButton'
import { formatPrice } from '@/lib/utils'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { getPrimaryGalleryImage, getProductSeo } from '@/lib/products'
import { withCelsius } from '@/lib/temperature'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'

type PageProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) return {}
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const product = docs[0] as Product | undefined
  if (!product) return { title: 'Not found' }

  const seo = getProductSeo(product)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, alt: product.name }] } : undefined,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        es: `/products/${slug}`,
        en: `/en/products/${slug}`,
        fr: `/fr/products/${slug}`,
        pt: `/pt/products/${slug}`,
      },
    },
  }
}

export default async function LocaleProductPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) notFound()
  const t = getDictionary(locale as Locale)!

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  })

  const product = docs[0] as Product | undefined
  if (!product) notFound()

  const gallery = product.gallery ?? []
  const heroImage = getPrimaryGalleryImage(product)
  const inStock = product.stock > 0

  const floweringSeasons = Array.isArray(product.floweringSeason)
    ? product.floweringSeason.join(', ')
    : product.floweringSeason

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-ro bg-ro-card ring-1 ring-ro-charcoal/5">
              {getMediaUrl(heroImage) ? (
                <MediaImage
                  src={getMediaUrl(heroImage)!}
                  alt={getMediaAlt(heroImage, product.name)}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <ProductImagePlaceholder />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(1, 5).map((item, i) => {
                  const url = getMediaUrl(item.image)
                  if (!url) return null
                  return (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-ro bg-ro-card"
                    >
                      <MediaImage
                        src={url}
                        alt={getMediaAlt(item.image, product.name)}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h1 className="ro-heading text-5xl md:text-6xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-ro-muted">
                {product.shortDescription}
              </p>
            )}
            <p className="mt-8 font-sans text-2xl text-ro-charcoal">{formatPrice(product.price)}</p>
            <p
              className={`mt-2 font-sans text-xs uppercase tracking-ro ${
                inStock ? 'text-ro-botanical' : 'text-ro-muted'
              }`}
            >
              {inStock ? t.productDetail.available : t.productDetail.soldOut}
            </p>

            <RichTextContent content={product.description} className="payload-richtext mt-10" />

            <div className="mt-10">
              <WhatsAppCheckoutButton
                productName={product.name}
                price={product.price}
                slug={product.slug}
                disabled={!inStock}
                locale={locale as Locale}
              />
            </div>

            <dl className="mt-16 grid gap-6 border-t border-ro-gold/25 pt-10 sm:grid-cols-2">
              {product.species && (
                <>
                  <dt className="ro-label">{t.productDetail.species}</dt>
                  <dd className="font-sans text-sm">{product.species}</dd>
                </>
              )}
              {product.hybrid && (
                <>
                  <dt className="ro-label">{t.productDetail.hybrid}</dt>
                  <dd className="font-sans text-sm">{product.hybrid}</dd>
                </>
              )}
              {floweringSeasons && (
                <>
                  <dt className="ro-label">{t.productDetail.flowering}</dt>
                  <dd className="font-sans text-sm capitalize">{floweringSeasons}</dd>
                </>
              )}
              {product.fragrance && (
                <>
                  <dt className="ro-label">{t.productDetail.fragrance}</dt>
                  <dd className="font-sans text-sm capitalize">{product.fragrance}</dd>
                </>
              )}
              {product.humidity && (
                <>
                  <dt className="ro-label">{t.careDetail.humidity}</dt>
                  <dd className="font-sans text-sm">{product.humidity}</dd>
                </>
              )}
              {product.temperature && (
                <>
                  <dt className="ro-label">{t.careDetail.temperature}</dt>
                  <dd className="font-sans text-sm">{withCelsius(product.temperature)}</dd>
                </>
              )}
              {product.lighting && (
                <>
                  <dt className="ro-label">{t.careDetail.light}</dt>
                  <dd className="font-sans text-sm capitalize">
                    {product.lighting.replace('-', ' ')}
                  </dd>
                </>
              )}
              {product.difficulty && (
                <>
                  <dt className="ro-label">{t.careDetail.difficulty}</dt>
                  <dd className="font-sans text-sm capitalize">{product.difficulty}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
