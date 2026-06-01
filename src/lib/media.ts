import type { Media } from '@/payload-types'

type MediaLike = Media | string | null | undefined

export function getMediaUrl(media: MediaLike): string | null {
  if (!media || typeof media === 'string') return null
  return media.url ?? null
}

export function getMediaAlt(media: MediaLike, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}
