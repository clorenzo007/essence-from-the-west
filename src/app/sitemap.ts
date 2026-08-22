import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getServerURL } from '@/lib/env'

/**
 * Generates /sitemap.xml. The site had none before, so nothing told
 * search engines which product/care/blog pages exist beyond whatever
 * they happened to crawl via links. Pulls every published doc from each
 * public collection plus the static top-level routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = getServerURL()
  const payload = await getPayloadClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${url}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${url}/catalog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${url}/care`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${url}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ]

  const [products, careSheets, blogPosts] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'care-sheets',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const productRoutes: MetadataRoute.Sitemap = products.docs
    .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({
      url: `${url}/products/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const careRoutes: MetadataRoute.Sitemap = careSheets.docs
    .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({
      url: `${url}/care/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.docs
    .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({
      url: `${url}/blog/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

  return [...staticRoutes, ...productRoutes, ...careRoutes, ...blogRoutes]
}
