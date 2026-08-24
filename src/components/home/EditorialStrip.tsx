import Link from 'next/link'

import { getSiteImageUrl } from '@/lib/site-images'

type EditorialStripProps = {
  imageUrl?: string | null
  imageAlt?: string
}

export function EditorialStrip({ imageUrl, imageAlt }: EditorialStripProps) {
  const editorialImage =
    imageUrl ||
    getSiteImageUrl('images/editorial-nursery.svg', '/images/editorial-nursery.svg')

  return (
    <section id="reserva" className="border-t border-ro-charcoal/8">
      <div className="grid md:grid-cols-2">
        <div
          className="relative aspect-square min-h-[400px] bg-cover bg-center md:aspect-auto md:min-h-[600px]"
          style={{ backgroundImage: `url("${editorialImage}")` }}
          role="img"
          aria-label={imageAlt || 'Orquídea en composición de colección'}
        />

        <div className="flex flex-col justify-center bg-ro-card/88 px-6 py-20 backdrop-blur-sm md:px-16 lg:px-24">
          <p className="ro-label mb-6 text-ro-gold">Reserva Oeste</p>
          <h2 className="ro-heading text-4xl md:text-5xl">
            Una colección,
            <br />
            no un vivero
          </h2>
          <p className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-ro-muted">
            Cada ejemplar se selecciona por su carácter, su flor y su mérito dentro de una
            colección privada. No vendemos plantas en serie: ofrecemos piezas para quienes cultivan
            con pasión y contemplación.
          </p>
          <Link href="/blog" className="ro-link mt-10 inline-block text-ro-gold">
            Leer el diario →
          </Link>
        </div>
      </div>
    </section>
  )
}
