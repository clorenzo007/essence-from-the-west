import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import { BrandWatermark } from '@/components/ui/BrandWatermark'
import { SITE_DESCRIPTOR, SITE_NAME } from '@/lib/constants'
import { defaultSiteMetadata } from '@/lib/site-metadata'

import '../globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  ...defaultSiteMetadata,
  title: {
    default: `${SITE_NAME} — ${SITE_DESCRIPTOR}`,
    template: `%s | ${SITE_NAME}`,
  },
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ro-ivory font-sans">
        <LocalBusinessJsonLd />
        <Header />
        <main className="ro-site-main">
          <BrandWatermark className="ro-watermark-layer" />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
