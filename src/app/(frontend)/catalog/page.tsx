import type { Metadata } from 'next'
import type { Where } from 'payload'

import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Product } from '@/payload-types'
import { mapProductToCard } from '@/lib/products'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Venta de Orquídeas en Ituzaingó y Zona Oeste GBA',
  description:
    'Venta de orquídeas de colección en Ituzaingó y toda la Zona Oeste del Gran Buenos Aires (GBA) — especies e híbridos seleccionados para coleccionistas y aficionados.',
  alternates: {
    languages: { es: '/catalog', en: '/en/catalog', fr: '/fr/catalog', pt: '/pt/catalog' },
  },
}

export const dynamic = 'force-dynamic'

const CATALOG_FAQS = [
  {
    question: '¿Dónde compro orquídeas en Ituzaingó y la Zona Oeste del GBA?',
    answer:
      'En Reserva Oeste, con base en Ituzaingó. Vendemos orquídeas de colección a coleccionistas y aficionados de toda la Zona Oeste del Gran Buenos Aires (GBA) — Ituzaingó, Morón, Hurlingham, Merlo y alrededores.',
  },
  {
    question: '¿Cómo se compra una orquídea?',
    answer:
      'Elegís el ejemplar en la colección y nos escribís por WhatsApp para confirmar disponibilidad. Coordinamos el pago y la entrega o el retiro con cita previa.',
  },
  {
    question: '¿Hacen envíos o entregas en la Zona Oeste?',
    answer:
      'Sí, coordinamos entrega o retiro con cita previa dentro de Ituzaingó y la Zona Oeste del Gran Buenos Aires. Escribinos por WhatsApp para ver opciones según la localidad.',
  },
] as const

const catalogFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CATALOG_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

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

  // Nunca mostrar en la vidriera pública un producto sin foto cargada
  // (evita el recuadro "Sin imagen" vacío para ejemplares de prueba u
  // olvidados sin galería).
  const products = (docs as Product[]).map(mapProductToCard).filter((product) => product.imageUrl)

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label="Venta de orquídeas · Ituzaingó, Zona Oeste GBA"
          title="La colección"
          description="Explorá ejemplares disponibles para coleccionistas de Ituzaingó y toda la Zona Oeste del Gran Buenos Aires (GBA). Cada pieza es única dentro de nuestra selección."
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

        <div className="mt-24 max-w-2xl border-t border-ro-charcoal/10 pt-16">
          <p className="ro-label mb-4 text-ro-gold">Preguntas frecuentes</p>
          <h2 className="ro-heading text-3xl md:text-4xl">Venta de orquídeas en la Zona Oeste</h2>
          <dl className="mt-10 space-y-8">
            {CATALOG_FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-sans text-sm font-medium text-ro-charcoal md:text-base">
                  {faq.question}
                </dt>
                <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-ro-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogFaqJsonLd) }}
      />
    </div>
  )
}
