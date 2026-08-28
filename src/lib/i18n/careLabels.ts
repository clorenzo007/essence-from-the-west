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
