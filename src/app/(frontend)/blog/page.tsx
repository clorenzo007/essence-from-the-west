import type { Metadata } from 'next'
import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { BlogPost } from '@/payload-types'
import { mapBlogPostToCard } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Orchid culture, nursery notes, and botanical editorial from Essence From The West.',
}

export const dynamic = 'force-dynamic'

export default async function BlogIndexPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    limit: 24,
    depth: 1,
    sort: '-publishedAt',
  })

  const posts = (docs as BlogPost[]).map(mapBlogPostToCard)

  return (
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeading
          label="Journal"
          title="Botanical Editorial"
          description="Growing wisdom, seasonal notes, and stories from the nursery."
          className="mb-16"
        />

        <div className="grid gap-12 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="border border-white/10 p-8">
              <p className="luxury-label">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Draft'}
              </p>
              <h2 className="luxury-heading mt-4 text-3xl">
                <Link href={`/blog/${post.slug}`} className="hover:opacity-70">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 font-sans text-sm text-luxury-silver">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="luxury-link mt-6 inline-block">
                Read →
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="font-sans text-sm text-luxury-silver">
            Published posts will appear here from the admin panel.
          </p>
        )}
      </div>
    </div>
  )
}
