/**
 * Care fields like `temperature` on Products, CareSheets and Specimens are
 * free text entered by an admin (e.g. "65–75°F day / 55–62°F night"), not a
 * structured number. Rather than migrate every existing record, this finds
 * every Fahrenheit value or range in the string and appends its Celsius
 * equivalent right next to it, so any text already in the CMS — past or
 * future — shows both scales wherever it's rendered.
 */

// Matches "75°F", "65-75°F", "65–75 F", etc. Requires a trailing F that
// isn't part of a longer word (so "Flor" or "Fragancia" never match).
const FAHRENHEIT_PATTERN =
  /(-?\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(-?\d+(?:[.,]\d+)?))?\s*°?\s*F(?![a-zA-Z])/g

function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9)
}

/**
 * Returns `text` with a "(NN°C)" or "(NN–NN°C)" equivalent appended after
 * every Fahrenheit value it finds. Non-temperature text passes through
 * unchanged. Safe to call with null/undefined (as Payload fields often are).
 */
export function withCelsius<T extends string | null | undefined>(text: T): T {
  if (!text) return text

  return text.replace(FAHRENHEIT_PATTERN, (match, low: string, high?: string) => {
    const lowC = fahrenheitToCelsius(parseFloat(low.replace(',', '.')))

    if (high) {
      const highC = fahrenheitToCelsius(parseFloat(high.replace(',', '.')))
      return `${match} (${lowC}–${highC}°C)`
    }

    return `${match} (${lowC}°C)`
  }) as T
}
