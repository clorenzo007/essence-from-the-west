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
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const message = [
    `Hola, me interesa consultar por:`,
    ``,
    `*${params.productName}*`,
    `Precio: ${formatPrice(params.price)}`,
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
