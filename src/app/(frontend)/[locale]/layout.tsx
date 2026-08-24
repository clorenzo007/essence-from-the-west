import { notFound } from 'next/navigation'

import { isSupportedLocale } from '@/lib/i18n/locales'

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Valida que /en, /fr o /pt sean los únicos prefijos de idioma válidos;
 * cualquier otro valor cae en 404. El Header y el Footer (definidos en el
 * layout padre `(frontend)/layout.tsx`) ya detectan el idioma leyendo la
 * URL, así que este layout no necesita renderizar nada propio.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()
  return children
}
