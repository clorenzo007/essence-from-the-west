import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
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

  const message = [
    `Hello, I'd like to inquire about:`,
    ``,
    `*${params.productName}*`,
    `Price: $${params.price.toLocaleString()}`,
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${params.slug}`,
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
