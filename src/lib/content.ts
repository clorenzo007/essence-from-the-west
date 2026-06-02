import type { BlogPost, CareSheet, Category } from '@/payload-types'

import { getMediaAlt, getMediaUrl } from '@/lib/media'

type SeoMeta = {
  title?: string | null
  description?: string | null
  keywords?: string | null
  ogImage?: unknown
  noIndex?: boolean | null
}

export function getCollectionSeo(
  doc: { meta?: SeoMeta | null },
  fallback: { title: string; description: string; ogImage?: unknown },
) {
  return {
    title: doc.meta?.title || fallback.title,
    description: doc.meta?.description || fallback.description,
    keywords: doc.meta?.keywords,
    noIndex: doc.meta?.noIndex ?? false,
    ogImageUrl: getMediaUrl(doc.meta?.ogImage as Parameters<typeof getMediaUrl>[0]) ??
      getMediaUrl(fallback.ogImage as Parameters<typeof getMediaUrl>[0]),
  }
}

export function mapCategoryToCard(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    shortDescription: category.shortDescription,
    coverImageUrl: getMediaUrl(category.coverImage),
    coverImageAlt: getMediaAlt(category.coverImage, category.name),
    featured: category.featured ?? false,
    sortOrder: category.sortOrder ?? 0,
  }
}

export function mapCareSheetToCard(sheet: CareSheet) {
  return {
    id: sheet.id,
    title: sheet.title,
    slug: sheet.slug,
    genus: sheet.genus,
    alliance: sheet.alliance,
    summary: sheet.summary,
    difficulty: sheet.difficulty,
    heroImageUrl: getMediaUrl(sheet.heroImage),
    heroImageAlt: getMediaAlt(sheet.heroImage, sheet.title),
    featured: sheet.featured ?? false,
  }
}

export function mapBlogPostToCard(post: BlogPost) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    coverImageUrl: getMediaUrl(post.coverImage),
    coverImageAlt: getMediaAlt(post.coverImage, post.title),
    featured: post.featured ?? false,
  }
}
