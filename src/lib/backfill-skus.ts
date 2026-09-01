import type { Payload } from 'payload'

import { resolveProductSkuPrefix, resolveSupplySkuPrefix } from '@/collections/shared/sku'

/**
 * Le asigna un código de inventario (SKU) a los productos/insumos que ya
 * existían de antes y todavía no tienen uno — el campo `sku` pasó a ser
 * obligatorio, pero eso solo aplica a partir de la próxima vez que se
 * guarde cada artículo; sin esto, los artículos viejos quedarían sin
 * código hasta que alguien los abra y guarde a mano.
 *
 * Se corre una vez en `onInit` (arranque del servidor Payload). Es
 * idempotente: si ya no queda ningún artículo sin código, no hace nada.
 */

type PrefixResolver = (doc: Record<string, unknown>) => string

export async function backfillMissingSkus(payload: Payload): Promise<void> {
  await backfillCollection(payload, 'products', (doc) => resolveProductSkuPrefix(doc.genus))
  await backfillCollection(payload, 'supplies', (doc) => resolveSupplySkuPrefix(doc.category))
}

async function backfillCollection(
  payload: Payload,
  collection: 'products' | 'supplies',
  getPrefix: PrefixResolver,
): Promise<void> {
  const { docs } = await payload.find({
    collection,
    where: {
      or: [{ sku: { equals: null } }, { sku: { equals: '' } }, { sku: { exists: false } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  if (docs.length === 0) return

  // Contador por prefijo (género/categoría), para no arrancar desde 1 en
  // cada artículo de un mismo grupo dentro de esta misma corrida.
  const nextByPrefix = new Map<string, number>()

  for (const doc of docs) {
    const prefix = getPrefix(doc as unknown as Record<string, unknown>)
    let n = nextByPrefix.get(prefix) ?? 1
    let candidate = `${prefix}-${String(n).padStart(4, '0')}`

    // eslint-disable-next-line no-await-in-loop
    while ((await payload.count({ collection, where: { sku: { equals: candidate } } })).totalDocs > 0) {
      n += 1
      candidate = `${prefix}-${String(n).padStart(4, '0')}`
    }

    // eslint-disable-next-line no-await-in-loop
    await payload.update({
      collection,
      id: doc.id,
      data: { sku: candidate },
      overrideAccess: true,
    })

    payload.logger.info(`[backfill-sku] ${collection} ${String(doc.id)} -> ${candidate}`)
    nextByPrefix.set(prefix, n + 1)
  }
}
