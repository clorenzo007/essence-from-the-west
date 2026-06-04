import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'

const careTopics = [
  { title: 'Humedad y circulación', href: '/care' },
  { title: 'Luz para floración', href: '/care' },
  { title: 'Ritmo de trasplante', href: '/care' },
  { title: 'Riego estacional', href: '/care' },
]

export function CarePreview() {
  return (
    <section className="border-t border-ro-charcoal/8 bg-ro-card py-24 md:py-32">
      <div className="ro-container">
        <SectionHeading
          label="Conocimiento"
          title="Guías de cultivo"
          description="Notas específicas para cultivadores serios — desde Cattleya intermedias hasta especies exigentes."
          className="mb-16"
        />

        <ul className="grid gap-px overflow-hidden rounded-ro border border-ro-charcoal/10 md:grid-cols-2">
          {careTopics.map((topic) => (
            <li key={topic.title}>
              <Link
                href={topic.href}
                className="flex items-center justify-between bg-ro-card px-8 py-10 transition-colors hover:bg-ro-ivory"
              >
                <span className="ro-heading text-2xl">{topic.title}</span>
                <span className="text-ro-gold">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link href="/care" className="ro-button-ghost">
            Todas las guías
          </Link>
        </div>
      </div>
    </section>
  )
}
