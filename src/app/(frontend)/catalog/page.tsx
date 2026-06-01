import type { Metadata } from 'next'
import type { Where } from 'payload'

import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Browse our curated orchid collection — species and hybrids for collectors.',
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
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeading
          label="Catalog"
          title="The Collection"
          description="Filter by difficulty, genus category, or search by name and species."
          className="mb-12"
        />

        <form
          method="get"
          className="mb-16 flex flex-col gap-4 border border-white/10 p-6 md:flex-row md:items-end"
        >
          <label className="flex-1">
            <span className="luxury-label mb-2 block">Search</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Phalaenopsis, Cattleya..."
              className="w-full border border-white/20 bg-transparent px-4 py-3 font-sans text-sm text-luxury-ivory placeholder:text-luxury-silver focus:border-luxury-ivory focus:outline-none"
            />
          </label>
          <label>
            <span className="luxury-label mb-2 block">Difficulty</span>
            <select
              name="difficulty"
              defaultValue={params.difficulty}
              className="w-full border border-white/20 bg-luxury-black px-4 py-3 font-sans text-sm text-luxury-ivory focus:border-luxury-ivory focus:outline-none md:w-48"
            >
              <option value="">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </label>
          <button type="submit" className="luxury-button md:mb-0">
            Apply
          </button>
        </form>

        {products.length > 0 ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-luxury-silver">No orchids match your filters.</p>
        )}
      </div>
    </div>
  )
}
