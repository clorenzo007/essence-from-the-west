import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './shared/access'
import { getCloudinaryImageUrl, isCloudinaryEnabled } from '@/lib/cloudinary'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  upload: {
    staticDir: 'media',
    // We used to also generate 'thumbnail' (400x500), 'card' (800x1000) and
    // 'hero' (1920x1080) derivatives here via Payload/sharp, each hard-cropped
    // to its box (position: 'centre'). That's redundant: Cloudinary already
    // serves every size the site needs, resized on the fly from this single
    // upload (see getCloudinaryImageUrl / getMediaUrl) — nothing reads
    // media.sizes.* for display.
    //
    // Worse, it actively corrupted uploads. Payload's cloud-storage plugin
    // calls our adapter's handleUpload once for the original AND once per
    // generated size, then merges every call's return value onto the SAME
    // top-level doc fields (filename/url/cloudinaryPublicId/width/height) —
    // last call wins. Our adapter returned those top-level fields for every
    // call, so whichever size was generated last (here, 'hero') silently
    // overwrote the true original with its own center-cropped 1920x1080
    // version. Any photo that wasn't already 16:9 got permanently cropped
    // the moment it was uploaded — the actual cause of the product photos
    // that kept looking cropped no matter what display-side fix we tried.
    // See cloudinaryAdapter.ts for a matching guard, kept as a second line
    // of defense in case sizes are ever reintroduced here.
    adminThumbnail: ({ doc }) => {
      const publicId = (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId
      if (isCloudinaryEnabled() && publicId) {
        return (
          getCloudinaryImageUrl(publicId, { width: 400, height: 500, crop: 'fit' }) ??
          (doc as { url?: string }).url ??
          ''
        )
      }
      return (doc as { url?: string }).url ?? ''
    },
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
