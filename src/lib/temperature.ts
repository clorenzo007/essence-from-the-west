/**
 * Care fields like `temperature` on Products, CareSheets and Specimens are
 * free text entered by an admin. In practice most records are just a bare
 * number or range ("65", "65-75") with no unit at all — the admin field's
 * hint text suggests "°F" but nobody actually types the unit. This site's
 * temperature convention is Fahrenheit either way, so:
 *
 *  - if the text has an explicit °F, convert just those values
 *  - if it already has an explicit °C, leave it alone (already dual/metric)
 *  - otherwise, treat any bare number/range in the field as Fahrenheit
 *
 * and append the Celsius equivalent right next to it, so any text already
 * in the CMS — past or future — shows both scales wherever it's rendered.
 */

// Matches "75°F", "65-75°F", "65–75 F", etc. Requires a trailing F that
// isn't part of a longer word (so "Flor" or "Fragancia" never match).
const FAHRENHEIT_PATTERN =
  /(-?\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(-?\d+(?:[.,]\d+)?))?\s*°?\s*F(?![a-zA-Z])/g

// Any number or number range, with no unit attached — used as a fallback
// when the field has no explicit °F/°C anywhere.
const BARE_NUMBER_PATTERN =
  /(-?\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(-?\d+(?:[.,]\d+)?))?/g

const HAS_FAHRENHEIT_UNIT = /\d\s*°?\s*F(?![a-zA-Z])/
const HAS_CELSIUS_UNIT = /\d\s*°?\s*C(?![a-zA-Z])/

function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9)
}

function appendCelsius(match: string, low: string, high?: string): string {
  const lowC = fahrenheitToCelsius(parseFloat(low.replace(',', '.')))

  if (high) {
    const highC = fahrenheitToCelsius(parseFloat(high.replace(',', '.')))
    return `${match} (${lowC}–${highC}°C)`
  }

  return `${match} (${lowC}°C)`
}

/**
 * Returns `text` with a "(NN°C)" or "(NN–NN°C)" equivalent appended after
 * every Fahrenheit value it finds (explicit °F, or bare numbers when no
 * unit is present at all). Text already in °C, or with no digits, passes
 * through unchanged. Safe to call with null/undefined.
 */
export function withCelsius<T extends string | null | undefined>(text: T): T {
  if (!text) return text

  if (HAS_FAHRENHEIT_UNIT.test(text)) {
    return text.replace(FAHRENHEIT_PATTERN, appendCelsius) as T
  }

  if (HAS_CELSIUS_UNIT.test(text) || !/\d/.test(text)) {
    return text
  }

  return text.replace(BARE_NUMBER_PATTERN, appendCelsius) as T
}
