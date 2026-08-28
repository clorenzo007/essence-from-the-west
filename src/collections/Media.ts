import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './shared/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 500,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 1000,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  admin: {
    group: 'Contenido',
    components: {
      beforeList: ['@/components/admin/MobileUploadBanner#MobileUploadBanner'],
    },
  },
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Set automatically when using Cloudinary storage.',
      },
    },
  ],
}
