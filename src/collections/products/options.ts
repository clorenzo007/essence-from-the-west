export { CONTENT_STATUS_OPTIONS as PRODUCT_STATUS_OPTIONS } from '@/collections/shared/options'

export { DIFFICULTY_OPTIONS, LIGHTING_OPTIONS } from '@/collections/shared/options'

export const FRAGRANCE_OPTIONS = [
  { label: 'Sin fragancia', value: 'none' },
  { label: 'Leve', value: 'light' },
  { label: 'Moderada', value: 'moderate' },
  { label: 'Intensa', value: 'strong' },
] as const

export const PLANT_SIZE_OPTIONS = [
  { label: 'Plántula', value: 'seedling' },
  { label: 'Cerca de floración (NBS)', value: 'nbs' },
  { label: 'Tamaño de floración (BS)', value: 'bs' },
  { label: 'Multi-brote / ejemplar', value: 'specimen' },
] as const

export const MOUNTING_OPTIONS = [
  { label: 'En maceta', value: 'potted' },
  { label: 'Montada', value: 'mounted' },
  { label: 'En canasto', value: 'basket' },
  { label: 'Cualquiera', value: 'either' },
] as const

export const FLOWERING_SEASON_OPTIONS = [
  { label: 'Invierno', value: 'winter' },
  { label: 'Primavera', value: 'spring' },
  { label: 'Verano', value: 'summer' },
  { label: 'Otoño', value: 'fall' },
  { label: 'Todo el año', value: 'year-round' },
  { label: 'Variable', value: 'variable' },
] as const

export const CURRENCY_OPTIONS = [
  { label: 'ARS ($)', value: 'ARS' },
  { label: 'USD (US$)', value: 'USD' },
] as const
