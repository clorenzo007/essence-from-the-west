import { getServerURL } from '@/lib/env'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Essence From The West'
export const SITE_TAGLINE = 'Rare orchids, cultivated with intention'
export const SERVER_URL = getServerURL()
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export { DIFFICULTY_OPTIONS } from '@/collections/shared/options'

export const NAV_LINKS = [
  { href: '/catalog', label: 'Collection' },
  { href: '/care', label: 'Care Guides' },
  { href: '/blog', label: 'Journal' },
] as const
