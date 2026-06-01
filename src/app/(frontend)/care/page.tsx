import type { Metadata } from 'next'
import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Orchid Care',
  description: 'Species-specific orchid care sheets for serious growers.',
}

export const dynamic = 'force-dynamic'

export default async function CareIndexPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'care-sheets',
    limit: 50,
    sort: 'title',
  })

  return (
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeading
          label="Care Guides"
          title="Orchid Care Sheets"
          description="Detailed cultural notes for each genus and alliance we offer."
          className="mb-16"
        />

        <ul className="divide-y divide-white/10 border border-white/10">
          {docs.map((sheet) => (
            <li key={sheet.id}>
              <Link
                href={`/care/${sheet.slug}`}
                className="flex flex-col gap-2 px-8 py-10 transition-colors hover:bg-luxury-charcoal md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="luxury-label">{sheet.genus || 'General'}</p>
                  <h2 className="luxury-heading text-3xl">{sheet.title}</h2>
                  <p className="mt-2 max-w-xl font-sans text-sm text-luxury-silver">{sheet.summary}</p>
                </div>
                {sheet.difficulty && (
                  <span className="luxury-label capitalize">{sheet.difficulty}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {docs.length === 0 && (
          <p className="font-sans text-sm text-luxury-silver">
            Care sheets will appear here once added in the admin panel.
          </p>
        )}
      </div>
    </div>
  )
}
