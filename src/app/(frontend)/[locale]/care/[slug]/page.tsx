import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'
import { RichTextContent } from '@/components/ui/RichTextContent'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CareSheet } from '@/payload-types'
import { getCollectionSeo } from '@/lib/content'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { withCelsius } from '@/lib/temperature'
import { getDictionary } from '@/lib/i18n/dictionary'
import { isSupportedLocale, type Locale } from '@/lib/i18n/locales'
import { difficultyLabel, lightingLabel } from '@/lib/i18n/careLabels'

type PageProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) return {}
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'care-sheets',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const sheet = docs[0] as CareSheet | undefined
  if (!sheet) return { title: 'Not found' }

  const seo = getCollectionSeo(sheet, {
    title: sheet.title,
    description: sheet.summary,
    ogImage: sheet.heroImage,
  })

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, alt: sheet.title }] } : undefined,
    alternates: {
      canonical: `/${locale}/care/${slug}`,
      languages: {
        es: `/care/${slug}`,
        en: `/en/care/${slug}`,
        fr: `/fr/care/${slug}`,
        pt: `/pt/care/${slug}`,
      },
    },
  }
}

export default async function LocaleCareSheetPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`
  const t = getDictionary(locale as Locale)!

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'care-sheets',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  })

  const sheet = docs[0] as CareSheet | undefined
  if (!sheet) notFound()

  const heroUrl = getMediaUrl(sheet.heroImage)

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label={sheet.genus}
          title={sheet.title}
          description={sheet.summary}
          className="mb-12"
        />

        {heroUrl && (
          <div className="relative mb-16 aspect-[21/9] overflow-hidden rounded-ro bg-ro-card">
            <MediaImage
              src={heroUrl}
              alt={getMediaAlt(sheet.heroImage, sheet.title)}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <dl className="mb-16 grid gap-6 rounded-ro border border-ro-charcoal/10 bg-ro-card p-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="ro-label">{t.careDetail.difficulty}</dt>
            <dd className="mt-2 font-sans text-sm">
              {difficultyLabel(sheet.difficulty, locale as Locale)}
            </dd>
          </div>
          {sheet.lighting && (
            <div>
              <dt className="ro-label">{t.careDetail.light}</dt>
              <dd className="mt-2 font-sans text-sm">
                {lightingLabel(sheet.lighting, locale as Locale)}
              </dd>
            </div>
          )}
          {sheet.humidity && (
            <div>
              <dt className="ro-label">{t.careDetail.humidity}</dt>
              <dd className="mt-2 font-sans text-sm">{sheet.humidity}</dd>
            </div>
          )}
          {sheet.temperature && (
            <div>
              <dt className="ro-label">{t.careDetail.temperature}</dt>
              <dd className="mt-2 font-sans text-sm">{withCelsius(sheet.temperature)}</dd>
            </div>
          )}
        </dl>

        <RichTextContent content={sheet.content} className="payload-richtext" />

        {(sheet.wateringNotes || sheet.fertilizerNotes) && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {sheet.wateringNotes && (
              <div className="rounded-ro border border-ro-charcoal/10 bg-ro-card p-8">
                <p className="ro-label text-ro-gold">{t.careDetail.wateringTips}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ro-muted">
                  {sheet.wateringNotes}
                </p>
              </div>
            )}
            {sheet.fertilizerNotes && (
              <div className="rounded-ro border border-ro-charcoal/10 bg-ro-card p-8">
                <p className="ro-label text-ro-gold">{t.careDetail.fertilizerTips}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ro-muted">
                  {sheet.fertilizerNotes}
                </p>
              </div>
            )}
          </div>
        )}

        <Link href={`${prefix}/care`} className="ro-link mt-16 inline-block text-ro-gold">
          {t.careDetail.backLink}
        </Link>
      </div>
    </div>
  )
}
