import { getServerURL } from '@/lib/env'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'RESERVA OESTE'
export const SITE_DESCRIPTOR = 'Orquídeas de Colección'
export const SITE_TAGLINE =
  'Especies e híbridos seleccionados para coleccionistas y aficionados.'
export const SITE_SECONDARY = 'Esencia del Oeste'
/** Logo oficial — no deformar, recolorear ni agregar efectos */
export const LOGO_SRC = '/images/logo.png'
export const SERVER_URL = getServerURL()
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export { DIFFICULTY_OPTIONS } from '@/collections/shared/options'

export const NAV_LINKS = [
  { href: '/catalog', label: 'Colección' },
  { href: '/care', label: 'Cuidado' },
  { href: '/blog', label: 'Diario' },
] as const
