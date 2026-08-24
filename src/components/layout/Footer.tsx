import Link from 'next/link'

import { Logo } from '@/components/layout/Logo'
import { NAV_LINKS, SITE_AREA_SERVED, SITE_LOCALITY, SITE_TAGLINE } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ro-charcoal/10 bg-ro-card/88 backdrop-blur-sm">
      <div className="ro-container grid gap-12 py-20 md:grid-cols-3">
        <div>
          <Logo size="footer" />
          <p className="mt-6 max-w-xs font-sans text-sm font-light leading-relaxed text-ro-muted">
            {SITE_TAGLINE}
          </p>
        </div>

        <div>
          <p className="ro-label mb-6">Explorar</p>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ro-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="ro-label mb-6">Contacto</p>
          <p className="font-sans text-sm font-light leading-relaxed text-ro-muted">
            {SITE_LOCALITY}, {SITE_AREA_SERVED}
            <br />
            Consultas por WhatsApp
            <br />
            Visitas con cita previa
          </p>
        </div>
      </div>

      <div className="border-t border-ro-gold/20">
        <div className="ro-container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="ro-label">© {year} RESERVA OESTE</p>
          <Link href="/admin" className="ro-label hover:text-ro-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
