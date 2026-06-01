import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Cached Payload instance for server components and server actions.
 * MongoDB connection is managed by the mongoose adapter in payload.config.ts.
 */
export const getPayloadClient = async () => {
  return getPayload({ config })
}
