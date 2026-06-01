import Link from 'next/link'

export function NewsletterCTA() {
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="luxury-container text-center">
        <p className="luxury-label mb-6">WhatsApp Checkout</p>
        <h2 className="luxury-heading mx-auto max-w-2xl text-4xl md:text-5xl">
          Reserve your specimen via private message
        </h2>
        <p className="mx-auto mt-6 max-w-lg font-sans text-sm font-light text-luxury-silver">
          Each orchid is offered individually. Select a plant from our collection and inquire
          directly — we confirm availability and arrange careful shipping.
        </p>
        <Link href="/catalog" className="luxury-button mt-10">
          Browse Collection
        </Link>
      </div>
    </section>
  )
}
