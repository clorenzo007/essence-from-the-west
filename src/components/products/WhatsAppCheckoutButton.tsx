import { getDictionary } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/locales'
import { buildWhatsAppCheckoutUrl } from '@/lib/utils'

type WhatsAppCheckoutButtonProps = {
  productName: string
  price: number
  slug: string
  disabled?: boolean
  locale?: Locale
}

export function WhatsAppCheckoutButton({
  productName,
  price,
  slug,
  disabled,
  locale,
}: WhatsAppCheckoutButtonProps) {
  const t = getDictionary(locale)
  const url = buildWhatsAppCheckoutUrl({ productName, price, slug })

  if (!url) {
    return (
      <p className="font-sans text-xs text-ro-muted">
        Configurá <code className="text-ro-charcoal">NEXT_PUBLIC_WHATSAPP_NUMBER</code> en el entorno
        para habilitar consultas.
      </p>
    )
  }

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noopener noreferrer"
      className={`ro-button ${disabled ? 'pointer-events-none opacity-40' : ''}`}
      aria-disabled={disabled}
    >
      {t?.productDetail.whatsappCta ?? 'Consultar por WhatsApp'}
    </a>
  )
}
