import type { MetadataRoute } from 'next'

import { getServerURL } from '@/lib/env'

/**
 * Generates /robots.txt. The site had none before — meaning search
 * engines had no explicit sitemap pointer and no guidance on which
 * routes to skip (admin, internal APIs, the mobile-only upload tool).
 */
export default function robots(): MetadataRoute.Robots {
  const url = getServerURL()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/subir-fotos'],
    },
    sitemap: `${url}/sitemap.xml`,
  }
}
