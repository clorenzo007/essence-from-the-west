import type { Metadata } from 'next'
import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CareSheet } from '@/payload-types'
import { mapCareSheetToCard } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Cuidado',
  description: 'Guías de cultivo de orquídeas para coleccionistas y cultivadores serios.',
}

export const dynamic = 'force-dynamic'

export default async function CareIndexPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'care-sheets',
    limit: 50,
    sort: 'title',
    depth: 1,
  })

  const sheets = (docs as CareSheet[]).map(mapCareSheetToCard)

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label="Cuidado"
          title="Guías de cultivo"
          description="Notas culturales detalladas por género y alianza."
          className="mb-16"
        />

        <ul className="divide-y divide-ro-charcoal/10 overflow-hidden rounded-ro border border-ro-charcoal/10 bg-ro-card">
          {sheets.map((sheet) => (
            <li key={sheet.id}>
              <Link
                href={`/care/${sheet.slug}`}
                className="flex flex-col gap-2 px-8 py-10 transition-colors hover:bg-ro-ivory md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="ro-label text-ro-gold">{sheet.genus}</p>
                  <h2 className="ro-heading text-3xl">{sheet.title}</h2>
                  <p className="mt-2 max-w-xl font-sans text-sm text-ro-muted">{sheet.summary}</p>
                </div>
                <span className="ro-label capitalize">{sheet.difficulty}</span>
              </Link>
            </li>
          ))}
        </ul>

        {sheets.length === 0 && (
          <p className="font-sans text-sm text-ro-muted">
            Las guías aparecerán aquí cuando las publiques en el panel de administración.
          </p>
        )}
      </div>
    </div>
  )
}
