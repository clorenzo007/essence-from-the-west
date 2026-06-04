import Link from 'next/link'

export function NewsletterCTA() {
  return (
    <section className="border-t border-ro-charcoal/8 py-24 md:py-32">
      <div className="ro-container text-center">
        <p className="ro-label mb-6 text-ro-gold">Consulta privada</p>
        <h2 className="ro-heading mx-auto max-w-2xl text-4xl md:text-5xl">
          Reservá tu ejemplar por mensaje
        </h2>
        <p className="mx-auto mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-ro-muted">
          Cada orquídea se ofrece de forma individual. Elegí una pieza de la colección y
          consultanos — confirmamos disponibilidad y coordinamos el envío con el máximo cuidado.
        </p>
        <Link href="/catalog" className="ro-button mt-10">
          Ver Colección
        </Link>
      </div>
    </section>
  )
}
