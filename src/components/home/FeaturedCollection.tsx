import Link from 'next/link'

import { ProductCard, type ProductCardData } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

type FeaturedCollectionProps = {
  products: ProductCardData[]
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="luxury-container">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            label="Curated Selection"
            title="Featured Orchids"
            description="Hand-selected specimens at peak vigor — each accompanied by detailed cultural notes."
          />
          <Link href="/catalog" className="luxury-link shrink-0">
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-luxury-silver">
            No featured orchids yet. Add products in the{' '}
            <Link href="/admin" className="underline">
              admin panel
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  )
}
