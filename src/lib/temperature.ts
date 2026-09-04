/**
 * Care fields like `temperature` on Products, CareSheets and Specimens are
 * free text entered by an admin. This site's convention is Celsius — the
 * admin field's hint text says so, and the seeded content confirms it (e.g.
 * "20–28°C día / 12–16°C noche") — so:
 *
 *  - if the text has an explicit °C, convert just those values
 *  - if it already has an explicit °F, leave it alone (already dual/imperial)
 *  - otherwise, treat any bare number/range in the field as Celsius
 *
 * and append the Fahrenheit equivalent right next to it, so any text already
 * in the CMS — past or future — shows both scales wherever it's rendered.
 */

// Matches "28°C", "20-28°C", "20–28 C", etc. Requires a trailing C that
// isn't part of a longer word (so no false positives on stray letters).
const CELSIUS_PATTERN =
  /(-?\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(-?\d+(?:[.,]\d+)?))?\s*°?\s*C(?![a-zA-Z])/g

// Any number or number range, with no unit attached — used as a fallback
// when the field has no explicit °F/°C anywhere.
const BARE_NUMBER_PATTERN =
  /(-?\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(-?\d+(?:[.,]\d+)?))?/g

const HAS_CELSIUS_UNIT = /\d\s*°?\s*C(?![a-zA-Z])/
const HAS_FAHRENHEIT_UNIT = /\d\s*°?\s*F(?![a-zA-Z])/

function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

// `match` already carries its own "°C" (it came from CELSIUS_PATTERN), so
// only the Fahrenheit equivalent needs to be appended.
function appendFahrenheit(match: string, low: string, high?: string): string {
  const lowF = celsiusToFahrenheit(parseFloat(low.replace(',', '.')))

  if (high) {
    const highF = celsiusToFahrenheit(parseFloat(high.replace(',', '.')))
    return `${match} (${lowF}–${highF}°F)`
  }

  return `${match} (${lowF}°F)`
}

// `match` here is a bare number/range with no unit at all (from
// BARE_NUMBER_PATTERN), so label it "°C" before appending the Fahrenheit
// equivalent — otherwise the original figure reads with no scale at all.
function appendCelsiusAndFahrenheit(match: string, low: string, high?: string): string {
  const lowF = celsiusToFahrenheit(parseFloat(low.replace(',', '.')))

  if (high) {
    const highF = celsiusToFahrenheit(parseFloat(high.replace(',', '.')))
    return `${match}°C (${lowF}–${highF}°F)`
  }

  return `${match}°C (${lowF}°F)`
}

/**
 * Returns `text` with a "(NN°F)" or "(NN–NN°F)" equivalent appended after
 * every Celsius value it finds. Explicit °C values are converted in place;
 * bare numbers (no unit at all) get an explicit "°C" label added too, so
 * the original figure is never left without a scale. Text already in °F,
 * or with no digits, passes through unchanged. Safe to call with
 * null/undefined.
 */
export function withFahrenheit<T extends string | null | undefined>(text: T): T {
  if (!text) return text

  if (HAS_CELSIUS_UNIT.test(text)) {
    return text.replace(CELSIUS_PATTERN, appendFahrenheit) as T
  }

  if (HAS_FAHRENHEIT_UNIT.test(text) || !/\d/.test(text)) {
    return text
  }

  return text.replace(BARE_NUMBER_PATTERN, appendCelsiusAndFahrenheit) as T
}
