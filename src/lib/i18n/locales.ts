/**
 * Idiomas secundarios del sitio. El español (contenido real: productos,
 * guías de cultivo, posts del blog) sigue viviendo, sin prefijo, en las
 * rutas de siempre — nada de esto las toca. Estos tres solo traducen la
 * interfaz fija (menús, botones, encabezados) vía /en, /fr, /pt.
 */
export const SUPPORTED_LOCALES = ['en', 'fr', 'pt'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export const LOCALE_LABELS: Record<'es' | Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  pt: 'Português',
}
