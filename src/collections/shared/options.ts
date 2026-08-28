export const CONTENT_STATUS_OPTIONS = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Archivado', value: 'archived' },
] as const

export const DIFFICULTY_OPTIONS = [
  { label: 'Principiante', value: 'beginner' },
  { label: 'Intermedio', value: 'intermediate' },
  { label: 'Avanzado', value: 'advanced' },
  { label: 'Experto', value: 'expert' },
] as const

export const LIGHTING_OPTIONS = [
  { label: 'Luz baja', value: 'low' },
  { label: 'Media indirecta', value: 'medium' },
  { label: 'Brillante indirecta', value: 'bright' },
  { label: 'Muy brillante / algo de sol directo', value: 'very-bright' },
] as const

export type SlugSourceField = 'name' | 'title'
