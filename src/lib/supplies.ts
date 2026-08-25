import type { Supply } from '@/payload-types'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { SupplyCardData } from '@/components/supplies/SupplyCard'

function getPrimaryGalleryItem(supply: Supply) {
  const gallery = supply.gallery ?? []
  return gallery.find((item) => item.isPrimary) ?? gallery[0]
}

export function mapSupplyToCard(supply: Supply): SupplyCardData {
  const primary = getPrimaryGalleryItem(supply)
  const image = primary?.image

  return {
    id: supply.id,
    name: supply.name,
    slug: supply.slug,
    category: supply.category,
    price: supply.price,
    currency: supply.currency ?? 'ARS',
    stock: supply.stock,
    imageUrl: getMediaUrl(image),
    imageAlt: getMediaAlt(image, supply.name),
    shortDescription: supply.shortDescription,
  }
}
