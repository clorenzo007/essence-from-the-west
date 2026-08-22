import type { Metadata } from 'next'
import type { Where } from 'payload'

import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Colección de Orquídeas',
  description:
    'Orquídeas de colección disponibles en Ituzaingó, Zona Oeste del Gran Buenos Aires — especies e híbridos seleccionados para coleccionistas y aficionados.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  q?: string
  difficulty?: string
  category?: string
}>

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const payload = await getPayloadClient()

  const and: Where[] = [{ status: { equals: 'published' } }]

  if (params.q) {
    and.push({
      or: [
        { name: { contains: params.q } },
        { species: { contains: params.q } },
        { hybrid: { contains: params.q } },
      ],
    })
  }

  if (params.difficulty) {
    and.push({ difficulty: { equals: params.difficulty } })
  }

  if (params.category) {
    and.push({ 'categories.slug': { equals: params.category } })
  }

  const where: Where = { and }

  const { docs } = await payload.find({
    collection: 'products',
    where,
    limit: 48,
    depth: 2,
    sort: 'name',
  })

  const products = (docs as Product[]).map(mapProductToCard)

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label="Colección"
          title="La colección"
          description="Explorá ejemplares disponibles. Cada pieza es única dentro de nuestra selección."
          className="mb-12"
        />

        <form
          method="get"
          className="mb-16 flex flex-col gap-4 rounded-ro border border-ro-charcoal/10 bg-ro-card p-6 md:flex-row md:items-end"
        >
          <label className="flex-1">
            <span className="ro-label mb-2 block">Buscar</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Nombre, especie..."
              className="w-full rounded-ro border border-ro-charcoal/15 bg-ro-ivory px-4 py-3 font-sans text-sm text-ro-charcoal placeholder:text-ro-muted focus:border-ro-gold focus:outline-none"
            />
          </label>
          <label>
            <span className="ro-label mb-2 block">Dificultad</span>
            <select
              name="difficulty"
              defaultValue={params.difficulty}
              className="w-full rounded-ro border border-ro-charcoal/15 bg-ro-ivory px-4 py-3 font-sans text-sm text-ro-charcoal focus:border-ro-gold focus:outline-none md:w-48"
            >
              <option value="">Todos</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
              <option value="expert">Experto</option>
            </select>
          </label>
          <button type="submit" className="ro-button md:mb-0">
            Filtrar
          </button>
        </form>

        {products.length > 0 ? (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-ro-muted">No hay ejemplares que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  )
}
