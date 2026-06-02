import Link from 'next/link'

import { SITE_TAGLINE } from '@/lib/constants'
import { getSiteImageUrl } from '@/lib/site-images'

export function HeroSection() {
  const heroImage = getSiteImageUrl('images/hero-orchid.svg', '/images/hero-orchid.svg')

  return (
    <section className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 70%), url("${heroImage}")`,
        }}
        role="img"
        aria-label="Rare orchid in dramatic botanical light"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/20 via-transparent to-luxury-black" />

      <div className="relative flex min-h-screen flex-col justify-end pb-24 pt-32">
        <div className="luxury-container animate-fade-in">
          <p className="luxury-label mb-6">Premium Orchid Nursery</p>
          <h1 className="luxury-heading max-w-4xl text-5xl leading-tight md:text-7xl lg:text-8xl">
            Essence
            <br />
            <span className="italic">From The West</span>
          </h1>
          <p className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-luxury-mist md:text-base">
            {SITE_TAGLINE}. Curated species and hybrids for discerning collectors.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/catalog" className="luxury-button">
              View Collection
            </Link>
            <Link href="/care" className="luxury-button-ghost">
              Care Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
