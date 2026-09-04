import { cookies } from 'next/headers'

import { CURRENCY_COOKIE_NAME, type DisplayCurrency } from '@/lib/utils'

/**
 * Lee la moneda de visualización elegida por el visitante (selector de
 * moneda en el header) desde la cookie. Si nunca la eligió, el default es
 * ARS — la moneda local en la que se cargan los precios.
 */
export async function getDisplayCurrency(): Promise<DisplayCurrency> {
  const store = await cookies()
  return store.get(CURRENCY_COOKIE_NAME)?.value === 'USD' ? 'USD' : 'ARS'
}
