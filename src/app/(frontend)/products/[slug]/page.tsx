import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'

import type { Product } from '@/payload-types'
import { WhatsAppCheckoutButton } from '@/components/products/WhatsAppCheckoutButton'
import { formatPrice } from '@/lib/utils'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { getPrimaryGalleryImage, getProductSeo } from '@/lib/products'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const product = docs[0] as Product | undefined
  if (!product) return { title: 'Orchid Not Found' }

  const seo = getProductSeo(product)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: seo.ogImageUrl
      ? {
          images: [{ url: seo.ogImageUrl, alt: product.name }],
        }
      : undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
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

  const floweringSeasons = Array.isArray(product.floweringSeason)
    ? product.floweringSeason.join(', ')
    : product.floweringSeason

  return (
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-luxury-charcoal">
              {getMediaUrl(heroImage) && (
                <MediaImage
                  src={getMediaUrl(heroImage)!}
                  alt={getMediaAlt(heroImage, product.name)}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(1, 5).map((item, i) => {
                  const url = getMediaUrl(item.image)
                  if (!url) return null
                  return (
                    <div key={i} className="relative aspect-square bg-luxury-charcoal">
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
            <p className="luxury-label">{product.species}</p>
            {product.hybrid && (
              <p className="mt-2 font-sans text-sm text-luxury-silver">{product.hybrid}</p>
            )}
            <h1 className="luxury-heading mt-4 text-5xl md:text-6xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-luxury-silver">
                {product.shortDescription}
              </p>
            )}
            <p className="mt-8 font-sans text-2xl">{formatPrice(product.price)}</p>
            <p className="mt-2 font-sans text-sm text-luxury-silver">
              {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
            </p>

            <div className="mt-10">
              <WhatsAppCheckoutButton
                productName={product.name}
                price={product.price}
                slug={product.slug}
                disabled={product.stock < 1}
              />
            </div>

            <dl className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2">
              {floweringSeasons && (
                <>
                  <dt className="luxury-label">Flowering</dt>
                  <dd className="font-sans text-sm capitalize">{floweringSeasons}</dd>
                </>
              )}
              {product.fragrance && (
                <>
                  <dt className="luxury-label">Fragrance</dt>
                  <dd className="font-sans text-sm capitalize">{product.fragrance}</dd>
                </>
              )}
              {product.humidity && (
                <>
                  <dt className="luxury-label">Humidity</dt>
                  <dd className="font-sans text-sm">{product.humidity}</dd>
                </>
              )}
              {product.temperature && (
                <>
                  <dt className="luxury-label">Temperature</dt>
                  <dd className="font-sans text-sm">{product.temperature}</dd>
                </>
              )}
              {product.lighting && (
                <>
                  <dt className="luxury-label">Lighting</dt>
                  <dd className="font-sans text-sm capitalize">{product.lighting.replace('-', ' ')}</dd>
                </>
              )}
              {product.difficulty && (
                <>
                  <dt className="luxury-label">Difficulty</dt>
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
