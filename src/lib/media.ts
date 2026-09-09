import type { Media } from '@/payload-types'

import { getCloudinaryImageUrl, isCloudinaryEnabled } from '@/lib/cloudinary'
import { SERVER_URL } from '@/lib/constants'

type MediaLike = (Media & { cloudinaryPublicId?: string | null }) | string | null | undefined

export function getMediaUrl(
  media: MediaLike,
  /**
   * Target display box for this image, e.g. { width: 800, height: 1000 }
   * for a product photo slot. When given (and Cloudinary is enabled), the
   * image is scaled to fit entirely inside that box (Cloudinary crop:
   * 'fit') instead of serving the raw original at native resolution — the
   * whole photo stays visible, just resized; nothing is cropped out.
   *
   * We tried a smart center-of-subject crop here first (fill + auto
   * gravity), which fixed the "only the flower's pouch is visible" bug,
   * but it still zoomed in and cut off part of the photo to fill the box
   * edge-to-edge. The ask is to always show the whole original photo, so
   * pair this with `object-contain` (not `object-cover`) on the <img> —
   * the box's own background shows as letterboxing where the photo's
   * aspect ratio doesn't match the box's.
   */
  box?: { width: number; height: number },
): string | null {
  if (!media || typeof media === 'string') return null

  if (isCloudinaryEnabled() && media.cloudinaryPublicId) {
    return (
      getCloudinaryImageUrl(media.cloudinaryPublicId, {
        width: box?.width,
        height: box?.height,
        crop: box ? 'fit' : undefined,
      }) ?? media.url ?? null
    )
  }

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
  return (
    url.includes('/api/media') ||
    url.startsWith('/media/') ||
    url.includes('res.cloudinary.com')
  )
}
