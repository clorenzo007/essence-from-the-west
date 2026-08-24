import { getServerURL } from '@/lib/env'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'RESERVA OESTE'
export const SITE_DESCRIPTOR = 'Orquídeas de Colección'
export const SITE_TAGLINE =
  'Especies e híbridos seleccionados para coleccionistas y aficionados.'
/** Logo oficial — no deformar, recolorear ni agregar efectos */
export const LOGO_SRC = '/images/logo.png'
export const SERVER_URL = getServerURL()
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

/**
 * Ubicación real del negocio, usada en metadata, datos estructurados
 * (LocalBusiness) y en el footer para reforzar señales de SEO local.
 * Solo localidad/región — no hay atención en local a la calle.
 */
export const SITE_LOCALITY = 'Ituzaingó'
export const SITE_REGION = 'Buenos Aires'
export const SITE_AREA_SERVED = 'Zona Oeste del Gran Buenos Aires (GBA)'
export const SITE_COUNTRY = 'AR'
export const SITE_SEO_DESCRIPTION =
  'Venta de orquídeas de colección en Ituzaingó y Zona Oeste del Gran Buenos Aires (GBA). Guías de cultivo y consultas por WhatsApp.'

export { DIFFICULTY_OPTIONS } from '@/collections/shared/options'

export const NAV_LINKS = [
  { href: '/catalog', label: 'Colección' },
  { href: '/care', label: 'Cuidado' },
  { href: '/blog', label: 'Diario' },
] as const
