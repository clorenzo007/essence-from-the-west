import Link from 'next/link'

import { MediaImage } from '@/components/ui/MediaImage'
import { ProductImagePlaceholder } from '@/components/products/ProductImagePlaceholder'
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-ro bg-ro-card shadow-sm ring-1 ring-ro-charcoal/5">
          {product.imageUrl ? (
            <MediaImage
              src={product.imageUrl}
              alt={product.imageAlt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <ProductImagePlaceholder />
          )}
        </div>

        <div className="mt-8 space-y-2 text-center md:text-left">
          <h3 className="ro-heading text-2xl">{product.name}</h3>
          <p className="font-sans text-sm text-ro-charcoal">{formatPrice(product.price)}</p>
          <p
            className={`font-sans text-xs uppercase tracking-ro ${
              inStock ? 'text-ro-botanical' : 'text-ro-muted'
            }`}
          >
            {inStock ? 'Disponible' : 'Agotado'}
          </p>
        </div>
      </Link>
    </article>
  )
}
