import type { Metadata } from 'next'

import { LOGO_SRC, SITE_NAME, SITE_SEO_DESCRIPTION } from '@/lib/constants'
import { getServerURL } from '@/lib/env'

/** Favicon, pestaña del navegador, Apple touch icon y previews sociales */
export const siteIcons: NonNullable<Metadata['icons']> = {
  icon: [{ url: LOGO_SRC, type: 'image/png', sizes: 'any' }],
  apple: [{ url: LOGO_SRC, type: 'image/png' }],
  shortcut: LOGO_SRC,
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(getServerURL()),
  icons: siteIcons,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE_NAME,
    images: [
      {
        url: LOGO_SRC,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary',
    images: [LOGO_SRC],
  },
  appleWebApp: {
    title: SITE_NAME,
  },
  applicationName: SITE_NAME,
  description: SITE_SEO_DESCRIPTION,
}
