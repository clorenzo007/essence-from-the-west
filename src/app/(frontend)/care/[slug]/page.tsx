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

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'care-sheets',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const sheet = docs[0] as CareSheet | undefined
  if (!sheet) return { title: 'Care Guide Not Found' }

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
  }
}

export default async function CareSheetPage({ params }: PageProps) {
  const { slug } = await params
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
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeading
          label={sheet.genus}
          title={sheet.title}
          description={sheet.summary}
          className="mb-12"
        />

        {heroUrl && (
          <div className="relative mb-16 aspect-[21/9] bg-luxury-charcoal">
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

        <dl className="mb-16 grid gap-6 border border-white/10 p-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="luxury-label">Difficulty</dt>
            <dd className="mt-2 font-sans text-sm capitalize">{sheet.difficulty}</dd>
          </div>
          {sheet.lighting && (
            <div>
              <dt className="luxury-label">Lighting</dt>
              <dd className="mt-2 font-sans text-sm capitalize">{sheet.lighting.replace('-', ' ')}</dd>
            </div>
          )}
          {sheet.humidity && (
            <div>
              <dt className="luxury-label">Humidity</dt>
              <dd className="mt-2 font-sans text-sm">{sheet.humidity}</dd>
            </div>
          )}
          {sheet.temperature && (
            <div>
              <dt className="luxury-label">Temperature</dt>
              <dd className="mt-2 font-sans text-sm">{sheet.temperature}</dd>
            </div>
          )}
        </dl>

        <RichTextContent
          content={sheet.content}
          className="font-sans text-sm font-light leading-relaxed text-luxury-mist"
        />

        <Link href="/care" className="luxury-link mt-16 inline-block">
          ← All care guides
        </Link>
      </div>
    </div>
  )
}
