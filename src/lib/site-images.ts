import fs from 'fs'
import path from 'path'

import { isCloudinaryEnabled } from '@/lib/cloudinary'

type Manifest = Record<string, string>

let cachedManifest: Manifest | null = null

function loadManifest(): Manifest {
  if (cachedManifest) return cachedManifest

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'cloudinary-manifest.json')
    if (fs.existsSync(manifestPath)) {
      cachedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Manifest
      return cachedManifest
    }
  } catch {
    // fall through to local paths
  }

  cachedManifest = {}
  return cachedManifest
}

/** Resolve homepage / editorial static art — Cloudinary after migration, else /public. */
export function getSiteImageUrl(key: string, localFallback: string): string {
  if (isCloudinaryEnabled()) {
    const url = loadManifest()[key]
    if (url) return url
  }
  return localFallback
}
