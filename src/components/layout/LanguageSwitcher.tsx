'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/locales'
import { cn } from '@/lib/utils'

/** Idioma actual + ruta sin el prefijo /en, /fr o /pt, para reconstruir el link al cambiar. */
function useCurrentLocale(): { locale: 'es' | Locale; basePath: string } {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) {
    const rest = segments.slice(1).join('/')
    return { locale: first as Locale, basePath: rest ? `/${rest}` : '/' }
  }

  return { locale: 'es', basePath: pathname }
}

export function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { locale, basePath } = useCurrentLocale()
  const [open, setOpen] = useState(false)

  const hrefFor = (target: 'es' | Locale) =>
    target === 'es' ? basePath : `/${target}${basePath === '/' ? '' : basePath}`

  const options: Array<'es' | Locale> = ['es', ...SUPPORTED_LOCALES]

  if (variant === 'mobile') {
    return (
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <a
            key={opt}
            href={hrefFor(opt)}
            className={cn(
              'ro-label rounded-ro border px-3 py-2',
              opt === locale
                ? 'border-ro-gold text-ro-gold'
                : 'border-ro-charcoal/15 text-ro-muted',
            )}
          >
            {LOCALE_LABELS[opt]}
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="ro-label flex items-center gap-1 text-ro-charcoal"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {locale.toUpperCase()}
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-3 w-40 rounded-ro border border-ro-charcoal/10 bg-ro-card py-2 shadow-lg">
            {options.map((opt) => (
              <a
                key={opt}
                href={hrefFor(opt)}
                className={cn(
                  'block px-4 py-2 font-sans text-sm hover:bg-ro-ivory',
                  opt === locale ? 'text-ro-gold' : 'text-ro-charcoal',
                )}
                onClick={() => setOpen(false)}
              >
                {LOCALE_LABELS[opt]}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
