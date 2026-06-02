import type { CollectionBeforeValidateHook } from 'payload'

export const validatePublishedCategory: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status !== 'published') return data

  if (!data?.name || typeof data.name !== 'string') {
    throw new Error('Published categories require a name.')
  }

  if (!data?.shortDescription || typeof data.shortDescription !== 'string') {
    throw new Error('Published categories require a short description.')
  }

  return data
}
