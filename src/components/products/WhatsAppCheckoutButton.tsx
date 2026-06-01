import { buildWhatsAppCheckoutUrl } from '@/lib/utils'

type WhatsAppCheckoutButtonProps = {
  productName: string
  price: number
  slug: string
  disabled?: boolean
}

export function WhatsAppCheckoutButton({
  productName,
  price,
  slug,
  disabled,
}: WhatsAppCheckoutButtonProps) {
  const url = buildWhatsAppCheckoutUrl({ productName, price, slug })

  if (!url) {
    return (
      <p className="font-sans text-xs text-luxury-silver">
        Set <code className="text-luxury-mist">NEXT_PUBLIC_WHATSAPP_NUMBER</code> in your env to
        enable checkout.
      </p>
    )
  }

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noopener noreferrer"
      className={`luxury-button ${disabled ? 'pointer-events-none opacity-40' : ''}`}
      aria-disabled={disabled}
    >
      Inquire via WhatsApp
    </a>
  )
}
