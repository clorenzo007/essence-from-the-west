import Link from 'next/link'

import { SITE_DESCRIPTOR, SITE_TAGLINE } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent">
      {/* Velo muy suave marfil — deja ver la marca de agua del layout */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ro-ivory/30 via-ro-ivory/55 to-ro-ivory"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-end pb-24 pt-32 md:pb-32">
        <div className="ro-container animate-fade-in">
          <p className="ro-label mb-6 text-ro-gold">{SITE_DESCRIPTOR}</p>
          <h1 className="ro-heading max-w-4xl text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            Orquídeas
            <br />
            <span className="italic">de Colección</span>
          </h1>
          <p className="mt-8 max-w-lg font-sans text-sm font-light leading-relaxed text-ro-muted md:text-base">
            {SITE_TAGLINE}
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/catalog" className="ro-button">
              Ver Colección
            </Link>
            <Link href="/#reserva" className="ro-button-ghost">
              Conocer Reserva Oeste
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 h-px w-16 -translate-x-1/2 bg-ro-gold/50"
        aria-hidden
      />
    </section>
  )
}
