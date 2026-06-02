import type { Product } from '@/payload-types'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { ProductCardData } from '@/components/products/ProductCard'

function getPrimaryGalleryItem(product: Product) {
  const gallery = product.gallery ?? []
  return gallery.find((item) => item.isPrimary) ?? gallery[0]
}

export function mapProductToCard(product: Product): ProductCardData {
  const primary = getPrimaryGalleryItem(product)
  const image = primary?.image

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    species: product.species,
    price: product.price,
    stock: product.stock,
    imageUrl: getMediaUrl(image),
    imageAlt: getMediaAlt(image, product.name),
    shortDescription: product.shortDescription,
    featured: product.featured ?? false,
    difficulty: product.difficulty ?? null,
  }
}

export function getProductSeo(product: Product) {
  const primary = getPrimaryGalleryItem(product)

  return {
    title: product.meta?.title || product.name,
    description: product.meta?.description || product.shortDescription,
    keywords: product.meta?.keywords,
    noIndex: product.meta?.noIndex ?? false,
    ogImageUrl: getMediaUrl(product.meta?.ogImage) ?? getMediaUrl(primary?.image),
  }
}

export function getPrimaryGalleryImage(product: Product) {
  return getPrimaryGalleryItem(product)?.image
}
