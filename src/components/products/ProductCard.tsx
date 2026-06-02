import Link from 'next/link'

import { MediaImage } from '@/components/ui/MediaImage'
import { formatPrice } from '@/lib/utils'

export type ProductCardData = {
  id: string
  name: string
  slug: string
  species: string
  price: number
  stock: number
  imageUrl?: string | null
  imageAlt?: string
  shortDescription?: string
  featured?: boolean
  difficulty?: string | null
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const inStock = product.stock > 0

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-luxury-charcoal">
          {product.imageUrl ? (
            <MediaImage
              src={product.imageUrl}
              alt={product.imageAlt || product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="luxury-label">No image</span>
            </div>
          )}
          {!inStock && (
            <span className="absolute left-4 top-4 bg-luxury-black/80 px-3 py-1 luxury-label">
              Sold Out
            </span>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <p className="luxury-label">{product.species}</p>
          <h3 className="luxury-heading text-2xl">{product.name}</h3>
          <p className="font-sans text-sm text-luxury-silver">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
