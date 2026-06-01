'use client'

import Link from 'next/link'
import { useState } from 'react'

import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-luxury-black/80 backdrop-blur-md">
      <div className="luxury-container flex h-20 items-center justify-between">
        <Link href="/" className="luxury-heading text-xl md:text-2xl">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="luxury-link">
              {link.label}
            </Link>
          ))}
          <Link href="/catalog" className="luxury-button">
            Shop
          </Link>
        </nav>

        <button
          type="button"
          className="luxury-label md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-white/5 bg-luxury-charcoal md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="luxury-container flex flex-col gap-6 py-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="luxury-link text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/catalog" className="luxury-button w-fit" onClick={() => setOpen(false)}>
            Shop
          </Link>
        </nav>
      </div>
    </header>
  )
}
