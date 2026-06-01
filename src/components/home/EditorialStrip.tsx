import Link from 'next/link'

export function EditorialStrip() {
  return (
    <section className="border-t border-white/5">
      <div className="grid md:grid-cols-2">
        <div
          className="relative aspect-square min-h-[400px] bg-cover bg-center md:aspect-auto md:min-h-[600px]"
          style={{ backgroundImage: 'url("/images/editorial-nursery.svg")' }}
          role="img"
          aria-label="Orchid nursery greenhouse with natural light"
        />

        <div className="flex flex-col justify-center px-6 py-20 md:px-16 lg:px-24">
          <p className="luxury-label mb-6">Our Philosophy</p>
          <h2 className="luxury-heading text-4xl md:text-5xl">
            Cultivated
            <br />
            with restraint
          </h2>
          <p className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-luxury-silver">
            We source from trusted breeders and grow each plant to blooming size before it
            reaches you. Every specimen ships with cultural guidance tailored to your climate.
          </p>
          <Link href="/blog" className="luxury-link mt-10 inline-block">
            Read the Journal →
          </Link>
        </div>
      </div>
    </section>
  )
}
