/**
 * Cotización del dólar del Banco Nación (BNA) para convertir precios
 * cargados en pesos argentinos (ARS) a dólares (USD) en el sitio público.
 *
 * El BNA no publica una API pública propia, así que esto lee directamente
 * la tabla "Cotización Divisas" de su sitio oficial (bna.com.ar). Como es
 * un scraping de HTML, puede romperse si el banco cambia el diseño de la
 * página — por eso hay una cadena de respaldo: si el scraping falla, se
 * usa el dólar "oficial" de una API pública confiable (dolarapi.com, que
 * sigue el mismo tipo de cambio de referencia que fija el BNA), y si eso
 * también falla, un valor fijo de emergencia para que el sitio nunca deje
 * de mostrar precios en dólares.
 *
 * El resultado se cachea 1 hora (revalidate) — no hace falta consultarlo
 * en cada request, la cotización no cambia tan seguido.
 */

export type BnaRateSource = 'bna' | 'dolarapi' | 'fallback'

export type BnaRate = {
  /** Precio al que el banco compra dólares (en pesos). */
  compra: number
  /** Precio al que el banco vende dólares (en pesos) — el que usamos para convertir ARS -> USD. */
  venta: number
  source: BnaRateSource
}

const REVALIDATE_SECONDS = 3600

// Valor de emergencia si tanto el scraping del BNA como la API de respaldo
// fallan. Es solo para que el sitio no se rompa — no hace falta mantenerlo
// al día con precisión, es el último recurso.
const FALLBACK_RATE: BnaRate = { compra: 1480, venta: 1530, source: 'fallback' }

function parseArNumber(raw: string): number {
  const cleaned = raw.trim()
  // Formato argentino: punto de miles, coma decimal (ej. "1.530,00").
  if (/,\d{1,4}$/.test(cleaned)) {
    return Number.parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
  }
  // Formato con punto decimal (ej. "1530.00"), por si acaso.
  return Number.parseFloat(cleaned.replace(/,/g, ''))
}

function isSaneRate(compra: number, venta: number): boolean {
  return (
    Number.isFinite(compra) &&
    Number.isFinite(venta) &&
    compra > 50 &&
    compra < 500_000 &&
    venta >= compra &&
    venta / compra < 1.3
  )
}

async function fetchFromBna(): Promise<BnaRate | null> {
  try {
    const res = await fetch('https://www.bna.com.ar/Personas', {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; EssenceFromTheWestBot/1.0; +https://essencefromthewest.com)',
      },
    })
    if (!res.ok) return null

    const html = await res.text()
    // Busca la fila "Dolar U.S.A" de la tabla "Cotización Divisas" y toma
    // los dos primeros números que aparecen después (compra, venta).
    const match = html.match(
      /Dolar\s*U\.?\s*S\.?\s*A\.?[\s\S]{0,300}?(\d{1,3}(?:\.\d{3})*,\d{2,4})[\s\S]{0,150}?(\d{1,3}(?:\.\d{3})*,\d{2,4})/i,
    )
    if (!match) return null

    const compra = parseArNumber(match[1])
    const venta = parseArNumber(match[2])
    if (!isSaneRate(compra, venta)) return null

    return { compra, venta, source: 'bna' }
  } catch {
    return null
  }
}

async function fetchFromDolarApiOficial(): Promise<BnaRate | null> {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares/oficial', {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null

    const data = (await res.json()) as { compra?: number; venta?: number }
    if (typeof data.compra !== 'number' || typeof data.venta !== 'number') return null
    if (!isSaneRate(data.compra, data.venta)) return null

    return { compra: data.compra, venta: data.venta, source: 'dolarapi' }
  } catch {
    return null
  }
}

export async function getBnaUsdRate(): Promise<BnaRate> {
  const fromBna = await fetchFromBna()
  if (fromBna) return fromBna

  const fromDolarApi = await fetchFromDolarApiOficial()
  if (fromDolarApi) return fromDolarApi

  return FALLBACK_RATE
}
