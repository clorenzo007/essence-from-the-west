import type { Product } from '@/payload-types'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { ProductCardData } from '@/components/products/ProductCard'

export function mapProductToCard(product: Product): ProductCardData {
  const firstImage = product.gallery?.[0]?.image

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    species: product.species,
    price: product.price,
    stock: product.stock,
    imageUrl: getMediaUrl(firstImage),
    imageAlt: getMediaAlt(firstImage, product.name),
  }
}
