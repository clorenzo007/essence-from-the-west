import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { BlogPost } from '@/payload-types'
import { mapBlogPostToCard } from '@/lib/content'
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
    title: t?.blogList.title,
    description: t?.blogList.desc,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { es: '/blog', en: '/en/blog', fr: '/fr/blog', pt: '/pt/blog' },
    },
  }
}

export default async function LocaleBlogIndexPage({ params }: PageProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  const prefix = `/${locale}`
  const t = getDictionary(locale as Locale)!

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    limit: 24,
    depth: 1,
    sort: '-publishedAt',
  })

  const posts = (docs as BlogPost[]).map(mapBlogPostToCard)

  return (
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label={t.blogList.label}
          title={t.blogList.title}
          description={t.blogList.desc}
          className="mb-16"
        />

        <div className="grid gap-12 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-ro border border-ro-charcoal/10 bg-ro-card p-8"
            >
              <p className="ro-label">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : t.blogList.draft}
              </p>
              <h2 className="ro-heading mt-4 text-3xl">
                <Link href={`${prefix}/blog/${post.slug}`} className="hover:text-ro-gold">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 font-sans text-sm text-ro-muted">{post.excerpt}</p>
              <Link
                href={`${prefix}/blog/${post.slug}`}
                className="ro-link mt-6 inline-block text-ro-gold"
              >
                {t.blogList.readMore}
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="font-sans text-sm text-ro-muted">{t.blogList.emptyText}</p>
        )}
      </div>
    </div>
  )
}
