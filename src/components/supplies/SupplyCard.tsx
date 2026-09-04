import { MediaImage } from '@/components/ui/MediaImage'
import { ProductImagePlaceholder } from '@/components/products/ProductImagePlaceholder'
import { buildWhatsAppSupplyInquiryUrl, formatDisplayPrice, type DisplayCurrency } from '@/lib/utils'

export type SupplyCardData = {
  id: string
  name: string
  slug: string
  category?: string | null
  price: number
  currency?: string | null
  stock: number
  imageUrl?: string | null
  imageAlt?: string
  shortDescription?: string
}

export function SupplyCard({
  supply,
  whatsappCtaLabel = 'Consultar por WhatsApp',
  availableLabel = 'Disponible',
  soldOutLabel = 'Agotado',
  displayCurrency,
  usdRate,
}: {
  supply: SupplyCardData
  whatsappCtaLabel?: string
  availableLabel?: string
  soldOutLabel?: string
  displayCurrency: DisplayCurrency
  usdRate: number
}) {
  const inStock = supply.stock > 0
  const whatsappUrl = buildWhatsAppSupplyInquiryUrl({
    name: supply.name,
    price: supply.price,
    currency: supply.currency ?? undefined,
  })

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-ro bg-ro-card shadow-sm ring-1 ring-ro-charcoal/5">
        {supply.imageUrl ? (
          <MediaImage
            src={supply.imageUrl}
            alt={supply.imageAlt || supply.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <ProductImagePlaceholder />
        )}
      </div>

      <div className="mt-8 space-y-2 text-center md:text-left">
        <h3 className="ro-heading text-2xl">{supply.name}</h3>
        {supply.shortDescription && (
          <p className="font-sans text-sm font-light leading-relaxed text-ro-muted">
            {supply.shortDescription}
          </p>
        )}
        <p className="font-sans text-sm text-ro-charcoal">
          {formatDisplayPrice(supply.price, supply.currency, displayCurrency, usdRate)}
        </p>
        <p
          className={`font-sans text-xs uppercase tracking-ro ${
            inStock ? 'text-ro-botanical' : 'text-ro-muted'
          }`}
        >
          {inStock ? availableLabel : soldOutLabel}
        </p>
      </div>

      {whatsappUrl && (
        <a
          href={inStock ? whatsappUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`ro-button mt-4 inline-block ${!inStock ? 'pointer-events-none opacity-40' : ''}`}
          aria-disabled={!inStock}
        >
          {whatsappCtaLabel}
        </a>
      )}
    </article>
  )
}
