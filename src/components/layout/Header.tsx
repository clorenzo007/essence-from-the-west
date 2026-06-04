'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Logo } from '@/components/layout/Logo'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ro-charcoal/8 bg-ro-ivory/92 backdrop-blur-md">
      <div className="ro-container flex h-20 items-center justify-between md:h-24">
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="ro-link">
              {link.label}
            </Link>
          ))}
          <Link href="/catalog" className="ro-button">
            Ver Colección
          </Link>
        </nav>

        <button
          type="button"
          className="ro-label md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Abrir menú"
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-ro-charcoal/8 bg-ro-card md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="ro-container flex flex-col gap-6 py-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ro-link text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/catalog" className="ro-button w-fit" onClick={() => setOpen(false)}>
            Ver Colección
          </Link>
        </nav>
      </div>
    </header>
  )
}
