import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Monedas que el visitante puede elegir para ver los precios del sitio. */
export type DisplayCurrency = 'ARS' | 'USD'

/** Nombre de la cookie donde se guarda la moneda elegida (selector en el header). */
export const CURRENCY_COOKIE_NAME = 'ro_currency'

/**
 * Convierte un monto cargado en `fromCurrency` a `toCurrency`, usando la
 * cotización de venta del dólar del BNA (`usdVenta`, en pesos por dólar).
 * Si ya está en la moneda pedida, lo devuelve tal cual.
 */
export function convertAmount(
  amount: number,
  fromCurrency: string | null | undefined,
  toCurrency: DisplayCurrency,
  usdVenta: number,
): number {
  const from: DisplayCurrency = fromCurrency === 'USD' ? 'USD' : 'ARS'
  if (from === toCurrency) return amount
  if (from === 'ARS' && toCurrency === 'USD') {
    return usdVenta > 0 ? amount / usdVenta : amount
  }
  // from === 'USD' && toCurrency === 'ARS'
  return amount * usdVenta
}

/** Convierte y formatea un precio para mostrarlo en la moneda elegida por el visitante. */
export function formatDisplayPrice(
  amount: number,
  itemCurrency: string | null | undefined,
  displayCurrency: DisplayCurrency,
  usdVenta: number,
) {
  return formatPrice(convertAmount(amount, itemCurrency, displayCurrency, usdVenta), displayCurrency)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildWhatsAppCheckoutUrl(params: {
  productName: string
  price: number
  slug: string
  currency?: string
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const message = [
    `Hola, me interesa consultar por:`,
    ``,
    `*${params.productName}*`,
    `Precio: ${formatPrice(params.price, params.currency)}`,
    `${baseUrl}/products/${params.slug}`,
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppVisitUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppSupplyInquiryUrl(params: { name: string; price: number; currency?: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const message = [
    `Hola, me interesa consultar por:`,
    ``,
    `*${params.name}*`,
    `Precio: ${formatPrice(params.price, params.currency)}`,
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
