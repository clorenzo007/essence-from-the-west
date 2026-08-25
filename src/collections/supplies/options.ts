export const SUPPLY_CATEGORY_OPTIONS = [
  { label: 'Sustratos', value: 'sustratos' },
  { label: 'Fertilizantes', value: 'fertilizantes' },
  { label: 'Pesticidas', value: 'pesticidas' },
  { label: 'Macetas', value: 'macetas' },
  { label: 'Canastas de madera', value: 'canastas' },
  { label: 'Otros insumos', value: 'otros' },
] as const

export type SupplyCategory = (typeof SUPPLY_CATEGORY_OPTIONS)[number]['value']
