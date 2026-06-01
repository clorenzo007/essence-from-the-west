import Link from 'next/link'

import { SectionHeading } from '@/components/ui/SectionHeading'

const careTopics = [
  { title: 'Humidity & Airflow', href: '/care' },
  { title: 'Light for Blooming', href: '/care' },
  { title: 'Repotting Rhythm', href: '/care' },
  { title: 'Seasonal Watering', href: '/care' },
]

export function CarePreview() {
  return (
    <section className="border-t border-white/5 bg-luxury-charcoal py-24 md:py-32">
      <div className="luxury-container">
        <SectionHeading
          label="Knowledge"
          title="Orchid Care Sheets"
          description="Species-specific guides written for serious growers — from intermediate Cattleya to advanced Dracula."
          className="mb-16"
        />

        <ul className="grid gap-px border border-white/10 md:grid-cols-2">
          {careTopics.map((topic) => (
            <li key={topic.title}>
              <Link
                href={topic.href}
                className="flex items-center justify-between bg-luxury-charcoal px-8 py-10 transition-colors hover:bg-luxury-black"
              >
                <span className="luxury-heading text-2xl">{topic.title}</span>
                <span className="luxury-label">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link href="/care" className="luxury-button-ghost">
            All Care Guides
          </Link>
        </div>
      </div>
    </section>
  )
}
