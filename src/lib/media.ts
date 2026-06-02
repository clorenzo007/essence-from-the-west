import type { Media } from '@/payload-types'

import { SERVER_URL } from '@/lib/constants'

type MediaLike = Media | string | null | undefined

export function getMediaUrl(media: MediaLike): string | null {
  if (!media || typeof media === 'string') return null

  const raw = media.url ?? null
  if (!raw) return null

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  const path = raw.startsWith('/') ? raw : `/${raw}`
  return `${SERVER_URL.replace(/\/$/, '')}${path}`
}

export function getMediaAlt(media: MediaLike, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}

export function isPayloadMediaUrl(url: string) {
  return url.includes('/api/media') || url.startsWith('/media/')
}
