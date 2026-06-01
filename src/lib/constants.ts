export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Essence From The West'
export const SITE_TAGLINE = 'Rare orchids, cultivated with intention'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Expert', value: 'expert' },
] as const

export const NAV_LINKS = [
  { href: '/catalog', label: 'Collection' },
  { href: '/care', label: 'Care Guides' },
  { href: '/blog', label: 'Journal' },
] as const
