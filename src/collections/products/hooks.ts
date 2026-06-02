import type { CollectionBeforeValidateHook } from 'payload'

import { createAutoGenerateSlugHook, createMetaSyncHook, validateSlugFormat } from '@/collections/shared/fields'

export const autoGenerateSlug = createAutoGenerateSlugHook('name')
export { validateSlugFormat }

export const validatePublishedProduct: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status !== 'published') return data

  if (!data?.gallery || !Array.isArray(data.gallery) || data.gallery.length < 1) {
    throw new Error('Published products require at least one gallery image.')
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    throw new Error('Published products require a valid price.')
  }

  if (typeof data.stock !== 'number' || data.stock < 0) {
    throw new Error('Published products require a valid stock count.')
  }

  if (!data?.categories || !Array.isArray(data.categories) || data.categories.length < 1) {
    throw new Error('Published products require at least one category.')
  }

  if (!data?.shortDescription || typeof data.shortDescription !== 'string') {
    throw new Error('Published products require a short description.')
  }

  if (!data?.description) {
    throw new Error('Published products require a full description.')
  }

  return data
}

export const syncMetaFromProduct = createMetaSyncHook({
  titleField: 'name',
  descriptionField: 'shortDescription',
})
