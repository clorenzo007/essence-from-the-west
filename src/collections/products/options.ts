export { CONTENT_STATUS_OPTIONS as PRODUCT_STATUS_OPTIONS } from '@/collections/shared/options'

export { DIFFICULTY_OPTIONS, LIGHTING_OPTIONS } from '@/collections/shared/options'

export const FRAGRANCE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Strong', value: 'strong' },
] as const

export const PLANT_SIZE_OPTIONS = [
  { label: 'Seedling', value: 'seedling' },
  { label: 'Near blooming size (NBS)', value: 'nbs' },
  { label: 'Blooming size (BS)', value: 'bs' },
  { label: 'Multi-growth / specimen', value: 'specimen' },
] as const

export const MOUNTING_OPTIONS = [
  { label: 'Potted', value: 'potted' },
  { label: 'Mounted', value: 'mounted' },
  { label: 'Basket', value: 'basket' },
  { label: 'Either', value: 'either' },
] as const

export const FLOWERING_SEASON_OPTIONS = [
  { label: 'Winter', value: 'winter' },
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
  { label: 'Year-round', value: 'year-round' },
  { label: 'Variable', value: 'variable' },
] as const

export const CURRENCY_OPTIONS = [{ label: 'USD ($)', value: 'USD' }] as const
