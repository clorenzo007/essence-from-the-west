import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductCard } from '@/components/products/ProductCard'
import { SupplyCard } from '@/components/supplies/SupplyCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product, Supply } from '@/payload-types'
import { TIENDA_CATEGORIES } from '@/lib/constants'
import { mapProductToCard } from '@/lib/products'
import { mapSupplyToCard } from '@/lib/supplies'
import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tienda — Orquídeas, sustratos, macetas y más | Reserva Oeste',
  description:
    'Orquídeas de colección, sustratos, fertilizantes, pesticidas, macetas y canastas de madera en Ituzaingó y Zona Oeste GBA.',
  alternates: {
    languages: { es: '/tienda', en: '/en/tienda', fr: '/fr/tienda', pt: '/pt/tienda' },
  },
}

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ category?: string }>

export default async function TiendaPage({ searchParams }: { searchParams: SearchParams }) {
  const { category: rawCategory } = await searchParams
  const category = TIENDA_CATEGORIES.some((c) => c.value === rawCategory) ? rawCategory! : 'orquideas'
  const payload = await getPayloadClient()

  let products: ReturnType<typeof mapProductToCard>[] = []
  let supplies: ReturnType<typeof mapSupplyToCard>[] = []

  if (category === 'orquideas') {
    const { docs } = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 48,
      depth: 2,
      sort: 'name',
    })
    products = (docs as Product[]).map(mapProductToCard).filter((p) => p.imageUrl)
  } else {
    const { docs } = await payload.find({
      collection: 'supplies',
      where: { and: [{ status: { equals: 'published' } }, { category: { equals: category } }] },
      limit: 48,
      depth: 2,
      sort: 'name',
    })
    supplies = (docs as Supply[]).map(mapSupplyToCard).filter((s) => s.imageUrl)
  }

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label="Tienda · Ituzaingó, Zona Oeste GBA"
          title="La tienda"
          description="Orquídeas de colección, sustratos, fertilizantes, pesticidas, macetas y canastas de madera — todo para cultivar con confianza."
          className="mb-12"
        />

        <nav className="mb-16 flex flex-wrap gap-3" aria-label="Categorías de la tienda">
          {TIENDA_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/tienda?category=${c.value}`}
              className={cn(
                'rounded-ro border px-5 py-2 font-sans text-xs uppercase tracking-ro transition-colors',
                category === c.value
                  ? 'border-ro-gold bg-ro-gold text-ro-ivory'
                  : 'border-ro-charcoal/15 text-ro-charcoal hover:border-ro-gold',
              )}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {category === 'orquideas' ? (
          <>
            {products.length > 0 ? (
              <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-ro-muted">No hay ejemplares disponibles por el momento.</p>
            )}
            <p className="mt-16 font-sans text-sm">
              <Link href="/catalog" className="ro-link text-ro-gold">
                Buscar por especie o dificultad →
              </Link>
            </p>
          </>
        ) : supplies.length > 0 ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {supplies.map((supply) => (
              <SupplyCard key={supply.id} supply={supply} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">Todavía no hay artículos en esta categoría.</p>
        )}
      </div>
    </div>
  )
}
