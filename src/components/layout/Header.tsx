'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Logo } from '@/components/layout/Logo'
import { NAV_LINKS } from '@/lib/constants'
import { getDictionary } from '@/lib/i18n/dictionary'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/locales'
import { cn } from '@/lib/utils'

function useLocalePrefix(): { locale?: Locale; prefix: string } {
  const pathname = usePathname() || '/'
  const first = pathname.split('/').filter(Boolean)[0]
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) {
    return { locale: first as Locale, prefix: `/${first}` }
  }
  return { locale: undefined, prefix: '' }
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { locale, prefix } = useLocalePrefix()
  const t = getDictionary(locale)

  const navLinks = [
    { href: `${prefix}/catalog`, label: t?.nav.catalog ?? NAV_LINKS[0].label },
    { href: `${prefix}/care`, label: t?.nav.care ?? NAV_LINKS[1].label },
    { href: `${prefix}/blog`, label: t?.nav.journal ?? NAV_LINKS[2].label },
  ]
  const viewCollectionLabel = t?.nav.viewCollection ?? 'Ver Colección'
  const menuLabel = t?.nav.menu ?? 'Menú'
  const closeLabel = t?.nav.close ?? 'Cerrar'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ro-charcoal/8 bg-ro-ivory/92 backdrop-blur-md">
      <div className="ro-container flex h-20 items-center justify-between md:h-24">
        <Logo href={prefix || '/'} />

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="ro-link">
              {link.label}
            </Link>
          ))}
          <Link href={`${prefix}/catalog`} className="ro-button">
            {viewCollectionLabel}
          </Link>
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="ro-label md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={menuLabel}
        >
          {open ? closeLabel : menuLabel}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-ro-charcoal/8 bg-ro-card md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="ro-container flex flex-col gap-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ro-link text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`${prefix}/catalog`}
            className="ro-button w-fit"
            onClick={() => setOpen(false)}
          >
            {viewCollectionLabel}
          </Link>
          <LanguageSwitcher variant="mobile" />
        </nav>
      </div>
    </header>
  )
}
