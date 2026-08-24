import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { getDictionary } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/locales'

const CARE_TOPICS_ES = [
  'Humedad y circulación',
  'Luz para floración',
  'Ritmo de trasplante',
  'Riego estacional',
]

export function CarePreview({ locale, prefix = '' }: { locale?: Locale; prefix?: string }) {
  const t = getDictionary(locale)
  const topics = t?.carePreview.topics ?? CARE_TOPICS_ES

  return (
    <section className="border-t border-ro-charcoal/8 bg-ro-card/85 py-24 backdrop-blur-sm md:py-32">
      <div className="ro-container">
        <SectionHeading
          label={t?.carePreview.label ?? 'Conocimiento'}
          title={t?.carePreview.title ?? 'Guías de cultivo'}
          description={
            t?.carePreview.desc ??
            'Notas específicas para cultivadores serios — desde Cattleya intermedias hasta especies exigentes.'
          }
          className="mb-16"
        />

        <ul className="grid gap-px overflow-hidden rounded-ro border border-ro-charcoal/10 md:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic}>
              <Link
                href={`${prefix}/care`}
                className="flex items-center justify-between bg-ro-card px-8 py-10 transition-colors hover:bg-ro-ivory"
              >
                <span className="ro-heading text-2xl">{topic}</span>
                <span className="text-ro-gold">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link href={`${prefix}/care`} className="ro-button-ghost">
            {t?.carePreview.viewAll ?? 'Todas las guías'}
          </Link>
        </div>
      </div>
    </section>
  )
}
