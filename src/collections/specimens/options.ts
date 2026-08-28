export { DIFFICULTY_OPTIONS, LIGHTING_OPTIONS } from '@/collections/shared/options'
export { CURRENCY_OPTIONS, MOUNTING_OPTIONS } from '@/collections/products/options'

export const LIFECYCLE_STATUS_OPTIONS = [
  { label: 'Activo en la colección', value: 'active' },
  { label: 'Vendido', value: 'sold' },
  { label: 'Regalado', value: 'gifted' },
  { label: 'Muerto', value: 'deceased' },
  { label: 'Archivado', value: 'archived' },
] as const

export const CARE_LOG_TYPE_OPTIONS = [
  { label: 'Riego', value: 'watering' },
  { label: 'Fertilización', value: 'fertilizing' },
  { label: 'Control de plagas / enfermedades (fumigación)', value: 'pest-control' },
  { label: 'Repique', value: 'repotting' },
  { label: 'Poda', value: 'pruning' },
  { label: 'División', value: 'division' },
  { label: 'Otro', value: 'other' },
] as const
