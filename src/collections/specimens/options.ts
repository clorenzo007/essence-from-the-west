export { DIFFICULTY_OPTIONS, LIGHTING_OPTIONS } from '@/collections/shared/options'
export { CURRENCY_OPTIONS, MOUNTING_OPTIONS } from '@/collections/products/options'

export const LIFECYCLE_STATUS_OPTIONS = [
  { label: 'Active in collection', value: 'active' },
  { label: 'Sold', value: 'sold' },
  { label: 'Gifted', value: 'gifted' },
  { label: 'Deceased', value: 'deceased' },
  { label: 'Archived', value: 'archived' },
] as const

export const CARE_LOG_TYPE_OPTIONS = [
  { label: 'Watering', value: 'watering' },
  { label: 'Fertilizing', value: 'fertilizing' },
  { label: 'Pest / disease control (spraying)', value: 'pest-control' },
  { label: 'Repotting', value: 'repotting' },
  { label: 'Pruning', value: 'pruning' },
  { label: 'Division', value: 'division' },
  { label: 'Other', value: 'other' },
] as const
