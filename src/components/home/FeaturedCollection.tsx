import Link from 'next/link'

import { ProductCard, type ProductCardData } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

type FeaturedCollectionProps = {
  products: ProductCardData[]
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  return (
    <section className="relative border-t border-ro-charcoal/8 bg-ro-ivory/75 py-24 backdrop-blur-[2px] md:py-32">
      <div className="ro-container">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            label="Selección"
            title="Ejemplares destacados"
            description="Piezas elegidas de la colección, listas para el coleccionista exigente."
          />
          <Link href="/catalog" className="ro-link shrink-0 text-ro-gold">
            Ver todo →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">
            Aún no hay ejemplares destacados. Publicá productos en el{' '}
            <Link href="/admin" className="text-ro-gold underline">
              panel de administración
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  )
}
