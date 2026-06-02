import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/ui/MediaImage'
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
  if (!post) return { title: 'Article Not Found' }

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
    <article className="pt-32 pb-24">
      <div className="luxury-container max-w-4xl">
        <p className="luxury-label">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null}
          {post.author ? ` · ${post.author}` : null}
        </p>

        <h1 className="luxury-heading mt-6 text-5xl md:text-6xl">{post.title}</h1>
        <p className="mt-8 font-sans text-base font-light leading-relaxed text-luxury-silver">
          {post.excerpt}
        </p>

        {coverUrl && (
          <div className="relative mt-12 aspect-[16/9] bg-luxury-charcoal">
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
              <li key={tag.id ?? tag.label} className="luxury-label border border-white/20 px-3 py-1">
                {tag.label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 font-sans text-sm leading-relaxed text-luxury-mist">
          <p className="text-luxury-silver">
            Full rich-text rendering coming soon. Edit content in the admin panel under Journal Posts.
          </p>
        </div>

        <Link href="/blog" className="luxury-link mt-16 inline-block">
          ← Back to journal
        </Link>
      </div>
    </article>
  )
}
