import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import type { Product } from '@/payload-types'
import { WhatsAppCheckoutButton } from '@/components/products/WhatsAppCheckoutButton'
import { formatPrice } from '@/lib/utils'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

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

  const product = docs[0]
  if (!product) return { title: 'Orchid Not Found' }

  return {
    title: product.meta?.title || product.name,
    description: product.meta?.description || `${product.species} — ${product.name}`,
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
  const heroImage = gallery[0]?.image

  return (
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-luxury-charcoal">
              {getMediaUrl(heroImage) && (
                <Image
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
                      <Image
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
              {product.floweringSeason && (
                <>
                  <dt className="luxury-label">Flowering</dt>
                  <dd className="font-sans text-sm">{product.floweringSeason}</dd>
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
                  <dd className="font-sans text-sm">{product.lighting}</dd>
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
