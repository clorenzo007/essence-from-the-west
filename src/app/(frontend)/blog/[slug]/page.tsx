import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'
import { RichTextContent } from '@/components/ui/RichTextContent'
import type { BlogPost } from '@/payload-types'
import { getCollectionSeo } from '@/lib/content'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const post = docs[0] as BlogPost | undefined
  if (!post) return { title: 'Artículo no encontrado' }

  const seo = getCollectionSeo(post, {
    title: post.title,
    description: post.excerpt,
    ogImage: post.coverImage,
  })

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, alt: post.title }] } : undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 1,
  })

  const post = docs[0] as BlogPost | undefined
  if (!post) notFound()

  const coverUrl = getMediaUrl(post.coverImage)

  return (
    <article className="pb-24 pt-32 md:pt-36">
      <div className="ro-container max-w-4xl">
        <p className="ro-label">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null}
          {post.author ? ` · ${post.author}` : null}
        </p>

        <h1 className="ro-heading mt-6 text-5xl md:text-6xl">{post.title}</h1>
        <p className="mt-8 font-sans text-base font-light leading-relaxed text-ro-muted">
          {post.excerpt}
        </p>

        {coverUrl && (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-ro bg-ro-card">
            <MediaImage
              src={coverUrl}
              alt={getMediaAlt(post.coverImage, post.title)}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <li
                key={tag.id ?? tag.label}
                className="ro-label rounded-ro border border-ro-charcoal/15 px-3 py-1"
              >
                {tag.label}
              </li>
            ))}
          </ul>
        )}

        <RichTextContent content={post.content} className="payload-richtext mt-12" />

        {post.gallery && post.gallery.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {post.gallery.map((item, i) => {
              const url = getMediaUrl(item.image)
              if (!url) return null
              return (
                <figure
                  key={item.id ?? i}
                  className="overflow-hidden rounded-ro border border-ro-charcoal/10 bg-ro-card"
                >
                  <div className="relative aspect-[4/3]">
                    <MediaImage
                      src={url}
                      alt={getMediaAlt(item.image, item.caption || post.title)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="p-4 font-sans text-sm leading-relaxed text-ro-muted">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        )}

        <Link href="/blog" className="ro-link mt-16 inline-block text-ro-gold">
          ← Volver al diario
        </Link>
      </div>
    </article>
  )
}
