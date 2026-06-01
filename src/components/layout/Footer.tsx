import Link from 'next/link'

import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-luxury-charcoal">
      <div className="luxury-container grid gap-12 py-20 md:grid-cols-3">
        <div>
          <p className="luxury-heading text-2xl">{SITE_NAME}</p>
          <p className="mt-4 max-w-xs font-sans text-sm font-light text-luxury-silver">
            {SITE_TAGLINE}
          </p>
        </div>

        <div>
          <p className="luxury-label mb-6">Explore</p>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="luxury-link">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalog" className="luxury-link">
                Shop Collection
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="luxury-label mb-6">Contact</p>
          <p className="font-sans text-sm font-light text-luxury-silver">
            Orders via WhatsApp
            <br />
            Private viewings by appointment
          </p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="luxury-container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="luxury-label">© {year} {SITE_NAME}</p>
          <Link href="/admin" className="luxury-label hover:text-luxury-ivory">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
