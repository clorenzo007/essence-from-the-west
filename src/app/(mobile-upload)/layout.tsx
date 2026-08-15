import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Subir fotos — Reserva Oeste',
  robots: { index: false, follow: false },
}

/**
 * Independent root layout (own <html>/<body>, no Tailwind, no site
 * header/footer) for the mobile-only "Subir desde el celu" tool. Kept
 * separate from (frontend) and (payload) on purpose: it only needs to be
 * simple and fast to use with one thumb.
 */
export default function MobileUploadLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"
        />
      </head>
      <body style={{ backgroundColor: '#f7f4ef' }}>{children}</body>
    </html>
  )
}
