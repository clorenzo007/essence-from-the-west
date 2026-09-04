'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { CURRENCY_COOKIE_NAME, cn, type DisplayCurrency } from '@/lib/utils'

const CURRENCY_OPTIONS: Array<{ value: DisplayCurrency; label: string }> = [
  { value: 'ARS', label: 'ARS $' },
  { value: 'USD', label: 'USD US$' },
]

/**
 * Selector de moneda del sitio (ARS / USD). Guarda la elección en una
 * cookie y refresca la página para que el servidor vuelva a formatear los
 * precios con la cotización del dólar del BNA. No hace falta backend
 * propio: la cookie es lo único que persiste la preferencia del visitante.
 */
export function CurrencySwitcher({
  initialCurrency = 'ARS',
  variant = 'desktop',
}: {
  initialCurrency?: DisplayCurrency
  variant?: 'desktop' | 'mobile'
}) {
  const router = useRouter()
  const [current, setCurrent] = useState<DisplayCurrency>(initialCurrency)
  const [open, setOpen] = useState(false)

  const select = (value: DisplayCurrency) => {
    setOpen(false)
    if (value === current) return
    document.cookie = `${CURRENCY_COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`
    setCurrent(value)
    router.refresh()
  }

  if (variant === 'mobile') {
    return (
      <div className="flex flex-wrap gap-3">
        {CURRENCY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => select(opt.value)}
            className={cn(
              'ro-label rounded-ro border px-3 py-2',
              opt.value === current ? 'border-ro-gold text-ro-gold' : 'border-ro-charcoal/15 text-ro-muted',
            )}
          >
            {opt.label}
          </button>
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
        {current}
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
          <div className="absolute right-0 z-20 mt-3 w-32 rounded-ro border border-ro-charcoal/10 bg-ro-card py-2 shadow-lg">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className={cn(
                  'block w-full px-4 py-2 text-left font-sans text-sm hover:bg-ro-ivory',
                  opt.value === current ? 'text-ro-gold' : 'text-ro-charcoal',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
