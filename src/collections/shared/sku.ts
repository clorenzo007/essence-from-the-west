import type { FieldHook } from 'payload'

/**
 * Códigos de inventario (SKU) por género (orquídeas) o categoría (insumos):
 * CYM-0001, PHAL-0002, CATT-0003… / SUS-0001, FERT-0002, MAC-0003…
 *
 * El número es correlativo DENTRO de cada prefijo (cada género/categoría
 * arranca su propia numeración desde 1), no un contador global.
 */

// Abreviaturas para los géneros de orquídeas más comunes en colecciones de
// coleccionistas. El campo "Género" en Orquídeas es texto libre, así que
// esto es una tabla de conveniencia: cualquier género que no esté acá cae
// en el fallback (primeras 4 letras del género) — podés seguir cargando
// cualquier género, solo cambia el prefijo del código.
const PRODUCT_GENUS_PREFIXES: Record<string, string> = {
  phalaenopsis: 'PHAL',
  cattleya: 'CATT',
  cymbidium: 'CYM',
  dendrobium: 'DEND',
  oncidium: 'ONC',
  vanda: 'VAND',
  paphiopedilum: 'PAPH',
  miltonia: 'MILT',
  odontoglossum: 'ODM',
  brassia: 'BRS',
  epidendrum: 'EPI',
  laelia: 'LAEL',
  masdevallia: 'MASD',
  zygopetalum: 'ZYGO',
  bulbophyllum: 'BULB',
  vanilla: 'VAN',
  encyclia: 'ENCY',
  ludisia: 'LUD',
  angraecum: 'ANGR',
}

/** Prefijo genérico para cuando todavía no se cargó el género de la planta. */
const PRODUCT_FALLBACK_PREFIX = 'ORQ'

export function resolveProductSkuPrefix(genus: unknown): string {
  if (typeof genus !== 'string') return PRODUCT_FALLBACK_PREFIX

  const key = genus.trim().toLowerCase().replace(/[^a-z]/g, '')
  if (!key) return PRODUCT_FALLBACK_PREFIX

  if (PRODUCT_GENUS_PREFIXES[key]) return PRODUCT_GENUS_PREFIXES[key]

  const fallback = key.slice(0, 4).toUpperCase()
  return fallback || PRODUCT_FALLBACK_PREFIX
}

// "category" en Insumos es un `select` de valores fijos (ver
// supplies/options.ts), así que acá el mapeo es exhaustivo — no hace falta
// fallback por letras.
const SUPPLY_CATEGORY_PREFIXES: Record<string, string> = {
  sustratos: 'SUS',
  fertilizantes: 'FERT',
  pesticidas: 'PEST',
  macetas: 'MAC',
  canastas: 'CAN',
  otros: 'INS',
}

const SUPPLY_FALLBACK_PREFIX = 'INS'

export function resolveSupplySkuPrefix(category: unknown): string {
  if (typeof category === 'string' && SUPPLY_CATEGORY_PREFIXES[category]) {
    return SUPPLY_CATEGORY_PREFIXES[category]
  }
  return SUPPLY_FALLBACK_PREFIX
}

/**
 * Genera el código cuando el campo se deja vacío al crear (o al editar un
 * artículo viejo que todavía no tenía uno). Si se escribe un código a
 * mano, se respeta tal cual (normalizado a mayúsculas).
 *
 * Busca el primer número libre con ese prefijo consultando la colección
 * (en vez de llevar un contador aparte) — para el volumen de una tienda
 * chica esto es más simple y no deja huecos si se borra algún artículo.
 */
export function createAutoGenerateSkuHook(
  collectionSlug: 'products' | 'supplies',
  getPrefix: (data: Record<string, unknown> | undefined | null) => string,
): FieldHook {
  return async ({ value, data, req }) => {
    if (value && typeof value === 'string' && value.trim().length > 0) {
      return value.trim().toUpperCase()
    }

    const prefix = getPrefix(data)
    let n = 1
    for (;;) {
      const candidate = `${prefix}-${String(n).padStart(4, '0')}`
      const { totalDocs } = await req.payload.count({
        collection: collectionSlug,
        where: { sku: { equals: candidate } },
      })
      if (totalDocs === 0) return candidate
      n += 1
    }
  }
}
