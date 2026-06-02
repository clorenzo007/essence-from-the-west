export const CONTENT_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
] as const

export const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Expert', value: 'expert' },
] as const

export const LIGHTING_OPTIONS = [
  { label: 'Low light', value: 'low' },
  { label: 'Medium indirect', value: 'medium' },
  { label: 'Bright indirect', value: 'bright' },
  { label: 'Very bright / some direct', value: 'very-bright' },
] as const

export type SlugSourceField = 'name' | 'title'
