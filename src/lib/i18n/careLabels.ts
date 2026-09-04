import type { Locale } from '@/lib/i18n/locales'

/**
 * Human-readable labels for the `difficulty` and `lighting` enum values
 * stored on products / care sheets (see collections/shared/options.ts).
 * The stored values themselves are English (`beginner`, `very-bright`,
 * etc.) — the Payload admin UI now shows the same Spanish labels defined
 * here (kept in sync with collections/shared/options.ts), and the public
 * site uses this map to show a translated label per locale instead of the
 * raw value.
 */

type DifficultyValue = 'beginner' | 'intermediate' | 'advanced' | 'expert'
type LightingValue = 'low' | 'medium' | 'bright' | 'very-bright'
type FloweringSeasonValue = 'winter' | 'spring' | 'summer' | 'fall' | 'year-round' | 'variable'
type FragranceValue = 'none' | 'light' | 'moderate' | 'strong'

const DIFFICULTY_LABELS: Record<'es' | Locale, Record<DifficultyValue, string>> = {
  es: {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto',
  },
  en: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  },
  fr: {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
  },
  pt: {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Especialista',
  },
}

const LIGHTING_LABELS: Record<'es' | Locale, Record<LightingValue, string>> = {
  es: {
    low: 'Luz baja',
    medium: 'Media indirecta',
    bright: 'Brillante indirecta',
    'very-bright': 'Muy brillante / algo de sol directo',
  },
  en: {
    low: 'Low light',
    medium: 'Medium indirect',
    bright: 'Bright indirect',
    'very-bright': 'Very bright / some direct',
  },
  fr: {
    low: 'Faible',
    medium: 'Indirecte moyenne',
    bright: 'Indirecte vive',
    'very-bright': 'Très vive / un peu de soleil direct',
  },
  pt: {
    low: 'Baixa',
    medium: 'Média indireta',
    bright: 'Brilhante indireta',
    'very-bright': 'Muito brilhante / algum sol direto',
  },
}

const FLOWERING_SEASON_LABELS: Record<'es' | Locale, Record<FloweringSeasonValue, string>> = {
  es: {
    winter: 'Invierno',
    spring: 'Primavera',
    summer: 'Verano',
    fall: 'Otoño',
    'year-round': 'Todo el año',
    variable: 'Variable',
  },
  en: {
    winter: 'Winter',
    spring: 'Spring',
    summer: 'Summer',
    fall: 'Fall',
    'year-round': 'Year-round',
    variable: 'Variable',
  },
  fr: {
    winter: 'Hiver',
    spring: 'Printemps',
    summer: 'Été',
    fall: 'Automne',
    'year-round': "Toute l'année",
    variable: 'Variable',
  },
  pt: {
    winter: 'Inverno',
    spring: 'Primavera',
    summer: 'Verão',
    fall: 'Outono',
    'year-round': 'Ano todo',
    variable: 'Variável',
  },
}

const FRAGRANCE_LABELS: Record<'es' | Locale, Record<FragranceValue, string>> = {
  es: {
    none: 'Sin fragancia',
    light: 'Leve',
    moderate: 'Moderada',
    strong: 'Intensa',
  },
  en: {
    none: 'No fragrance',
    light: 'Light',
    moderate: 'Moderate',
    strong: 'Strong',
  },
  fr: {
    none: 'Sans parfum',
    light: 'Légère',
    moderate: 'Modérée',
    strong: 'Intense',
  },
  pt: {
    none: 'Sem fragrância',
    light: 'Leve',
    moderate: 'Moderada',
    strong: 'Intensa',
  },
}

export function difficultyLabel(
  value?: string | null,
  locale: 'es' | Locale = 'es',
): string {
  if (!value) return ''
  return DIFFICULTY_LABELS[locale]?.[value as DifficultyValue] ?? value
}

export function lightingLabel(value?: string | null, locale: 'es' | Locale = 'es'): string {
  if (!value) return ''
  return LIGHTING_LABELS[locale]?.[value as LightingValue] ?? value
}

export function floweringSeasonLabel(value?: string | null, locale: 'es' | Locale = 'es'): string {
  if (!value) return ''
  return FLOWERING_SEASON_LABELS[locale]?.[value as FloweringSeasonValue] ?? value
}

export function fragranceLabel(value?: string | null, locale: 'es' | Locale = 'es'): string {
  if (!value) return ''
  return FRAGRANCE_LABELS[locale]?.[value as FragranceValue] ?? value
}
