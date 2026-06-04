import type { Metadata } from 'next'
import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { BlogPost } from '@/payload-types'
import { mapBlogPostToCard } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Diario',
  description: 'Notas botánicas, cultivo y editorial desde Reserva Oeste.',
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
    <div className="pb-24 pt-32 md:pt-36">
      <div className="ro-container">
        <SectionHeading
          label="Diario"
          title="Editorial botánico"
          description="Cultivo, estación y relatos desde la colección."
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
                  : 'Borrador'}
              </p>
              <h2 className="ro-heading mt-4 text-3xl">
                <Link href={`/blog/${post.slug}`} className="hover:text-ro-gold">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 font-sans text-sm text-ro-muted">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="ro-link mt-6 inline-block text-ro-gold">
                Leer →
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="font-sans text-sm text-ro-muted">
            Las entradas publicadas aparecerán aquí desde el panel de administración.
          </p>
        )}
      </div>
    </div>
  )
}
