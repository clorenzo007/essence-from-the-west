import Link from 'next/link'

import { getDictionary } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/locales'
import { buildWhatsAppVisitUrl } from '@/lib/utils'

const VISIT_MESSAGE = 'Hola! Me gustaría coordinar una visita a Reserva Oeste.'

export function NewsletterCTA({ locale, prefix = '' }: { locale?: Locale; prefix?: string }) {
  const t = getDictionary(locale)
  const visitUrl = buildWhatsAppVisitUrl(VISIT_MESSAGE)

  return (
    <section className="relative border-t border-ro-charcoal/8 bg-ro-ivory/75 py-24 backdrop-blur-[2px] md:py-32">
      <div className="ro-container text-center">
        <p className="ro-label mb-6 text-ro-gold">{t?.newsletter.label ?? 'Consulta privada'}</p>
        <h2 className="ro-heading mx-auto max-w-2xl text-4xl md:text-5xl">
          {t?.newsletter.title ?? 'Reservá tu ejemplar por mensaje'}
        </h2>
        <p className="mx-auto mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-ro-muted">
          {t?.newsletter.body ??
            'Cada orquídea se ofrece de forma individual. Elegí una pieza de la colección y consultanos — confirmamos disponibilidad y coordinamos el envío con el máximo cuidado.'}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={`${prefix}/catalog`} className="ro-button">
            {t?.newsletter.cta ?? 'Ver Colección'}
          </Link>
          {visitUrl && (
            <a href={visitUrl} target="_blank" rel="noopener noreferrer" className="ro-button-ghost">
              {t?.newsletter.visitCta ?? 'Agendar visita'}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
