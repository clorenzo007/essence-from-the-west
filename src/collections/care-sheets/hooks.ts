import type { CollectionBeforeValidateHook } from 'payload'

export const validatePublishedCareSheet: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status !== 'published') return data

  if (!data?.title || typeof data.title !== 'string') {
    throw new Error('Published care sheets require a title.')
  }

  if (!data?.summary || typeof data.summary !== 'string') {
    throw new Error('Published care sheets require a summary.')
  }

  if (!data?.content) {
    throw new Error('Published care sheets require full content.')
  }

  if (!data?.difficulty) {
    throw new Error('Published care sheets require a difficulty level.')
  }

  return data
}
