import type { CollectionBeforeValidateHook } from 'payload'

export const validatePublishedBlogPost: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status !== 'published') return data

  if (!data?.title || typeof data.title !== 'string') {
    throw new Error('Published posts require a title.')
  }

  if (!data?.excerpt || typeof data.excerpt !== 'string') {
    throw new Error('Published posts require an excerpt.')
  }

  if (!data?.content) {
    throw new Error('Published posts require content.')
  }

  if (!data?.publishedAt) {
    throw new Error('Published posts require a publish date.')
  }

  return data
}

export const setPublishedAtOnPublish: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.status === 'published' && !data?.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}
