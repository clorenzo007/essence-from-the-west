import type { CollectionBeforeValidateHook } from 'payload'

import { createAutoGenerateSlugHook, createMetaSyncHook, validateSlugFormat } from '@/collections/shared/fields'

export const autoGenerateSupplySlug = createAutoGenerateSlugHook('name')
export { validateSlugFormat }

export const validatePublishedSupply: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status !== 'published') return data

  if (!data?.gallery || !Array.isArray(data.gallery) || data.gallery.length < 1) {
    throw new Error('Los insumos publicados requieren al menos una foto.')
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    throw new Error('Los insumos publicados requieren un precio válido.')
  }

  if (typeof data.stock !== 'number' || data.stock < 0) {
    throw new Error('Los insumos publicados requieren una cantidad de stock válida.')
  }

  if (!data?.category) {
    throw new Error('Los insumos publicados requieren una categoría.')
  }

  if (!data?.shortDescription || typeof data.shortDescription !== 'string') {
    throw new Error('Los insumos publicados requieren una descripción breve.')
  }

  return data
}

export const syncMetaFromSupply = createMetaSyncHook({
  titleField: 'name',
  descriptionField: 'shortDescription',
})
