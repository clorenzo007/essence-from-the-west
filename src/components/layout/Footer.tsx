'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/layout/Logo'
import { getDictionary } from '@/lib/i18n/dictionary'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/locales'
import { NAV_LINKS, SITE_AREA_SERVED, SITE_LOCALITY, SITE_TAGLINE } from '@/lib/constants'

function useLocalePrefix(): { locale?: Locale; prefix: string } {
  const pathname = usePathname() || '/'
  const first = pathname.split('/').filter(Boolean)[0]
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) {
    return { locale: first as Locale, prefix: `/${first}` }
  }
  return { locale: undefined, prefix: '' }
}

export function Footer() {
  const year = new Date().getFullYear()
  const { locale, prefix } = useLocalePrefix()
  const t = getDictionary(locale)

  const navLinks = [
    { href: `${prefix}/catalog`, label: t?.nav.catalog ?? NAV_LINKS[0].label },
    { href: `${prefix}/care`, label: t?.nav.care ?? NAV_LINKS[1].label },
    { href: `${prefix}/blog`, label: t?.nav.journal ?? NAV_LINKS[2].label },
  ]

  return (
    <footer className="border-t border-ro-charcoal/10 bg-ro-card/88 backdrop-blur-sm">
      <div className="ro-container grid gap-12 py-20 md:grid-cols-3">
        <div>
          <Logo size="footer" href={prefix || '/'} />
          <p className="mt-6 max-w-xs font-sans text-sm font-light leading-relaxed text-ro-muted">
            {SITE_TAGLINE}
          </p>
        </div>

        <div>
          <p className="ro-label mb-6">{t?.footer.explore ?? 'Explorar'}</p>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ro-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="ro-label mb-6">{t?.footer.contact ?? 'Contacto'}</p>
          <p className="font-sans text-sm font-light leading-relaxed text-ro-muted">
            {SITE_LOCALITY}, {SITE_AREA_SERVED}
            <br />
            {t?.footer.whatsapp ?? 'Consultas por WhatsApp'}
            <br />
            {t?.footer.visits ?? 'Visitas con cita previa'}
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
