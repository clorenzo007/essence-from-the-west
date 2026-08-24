import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CareSheet } from '@/payload-types'
import { mapCareSheetToCard } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isSupportedLocale(locale)) return {}
  const t = getDictionary(locale as Locale)
  return {
    title: t?.careList.title,
    description: t?.careList.desc,
    alternates: {
      canonical: `/${locale}/care`,
      languages: { es: '/care', en: '/en/care', fr: '/fr/care', pt: '/pt/care' },
    },
  }
}

export default async function LocaleCareIndexPage({ params }: PageProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`
  const t = getDictionary(locale as Locale)!

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
          label={t.nav.care}
          title={t.careList.title}
          description={t.careList.desc}
          className="mb-16"
        />

        <ul className="divide-y divide-ro-charcoal/10 overflow-hidden rounded-ro border border-ro-charcoal/10 bg-ro-card">
          {sheets.map((sheet) => (
            <li key={sheet.id}>
              <Link
                href={`${prefix}/care/${sheet.slug}`}
                className="flex flex-col gap-6 px-8 py-10 transition-colors hover:bg-ro-ivory md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  {sheet.heroImageUrl && (
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-ro bg-ro-ivory md:w-40">
                      <MediaImage
                        src={sheet.heroImageUrl}
                        alt={sheet.heroImageAlt || sheet.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 160px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="ro-label text-ro-gold">{sheet.genus}</p>
                    <h2 className="ro-heading text-3xl">{sheet.title}</h2>
                    <p className="mt-2 max-w-xl font-sans text-sm text-ro-muted">{sheet.summary}</p>
                  </div>
                </div>
                <span className="ro-label capitalize">{sheet.difficulty}</span>
              </Link>
            </li>
          ))}
        </ul>

        {sheets.length === 0 && (
          <p className="font-sans text-sm text-ro-muted">{t.careList.emptyText}</p>
        )}
      </div>
    </div>
  )
}
