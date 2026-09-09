import { Readable } from 'stream'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

import { getCloudinaryConfig, isCloudinaryEnabled } from '@/lib/cloudinary'

function initCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export const cloudinaryAdapter: Adapter = ({ prefix }) => {
  if (!isCloudinaryEnabled()) {
    throw new Error('Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
  }

  initCloudinary()
  const folder = prefix || getCloudinaryConfig().folder

  return {
    name: 'cloudinary',
    async handleUpload({ file, data }) {
      // Payload's cloud-storage plugin calls this once for the original file
      // AND once per configured collection imageSize, all sharing the SAME
      // `data` (the doc so far) — then shallow-merges every return value onto
      // the doc's TOP-LEVEL fields, last call wins. If a size's result were
      // returned the same way as the original's, whichever size uploads last
      // would silently overwrite the real original's url/filename/
      // cloudinaryPublicId/width/height with that size's own (possibly
      // cropped) file — which is exactly what corrupted every product photo
      // that wasn't already 16:9 before the Media collection's imageSizes
      // were removed. Media no longer defines any sizes, so this should
      // never actually trigger — kept as a guard in case a size gets
      // reintroduced there or on another collection reusing this adapter.
      const sizeName = Object.entries(
        (data as { sizes?: Record<string, { filename?: string }> } | undefined)?.sizes ?? {},
      ).find(([, size]) => size?.filename === file.filename)?.[0]

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            filename_override: file.filename,
            folder,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) reject(error ?? new Error('Cloudinary upload failed'))
            else resolve(uploadResult)
          },
        )
        Readable.from(file.buffer).pipe(stream)
      })

      const extension = result.format ? `.${result.format}` : ''
      const filename = result.original_filename
        ? `${result.original_filename}${extension}`
        : file.filename

      if (sizeName) {
        // A size's own entry has no cloudinaryPublicId field in Payload's
        // schema — only the fields a size derivative actually has.
        return {
          sizes: {
            [sizeName]: {
              url: result.secure_url,
              filename,
              width: result.width,
              height: result.height,
              filesize: result.bytes,
              mimeType: file.mimeType,
            },
          },
        }
      }

      return {
        ...data,
        url: result.secure_url,
        filename,
        cloudinaryPublicId: result.public_id,
        width: result.width,
        height: result.height,
        filesize: result.bytes,
        mimeType: file.mimeType,
      }
    },
    async handleDelete({ doc }) {
      const publicId = (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId
      if (!publicId) return

      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
    },
    generateURL: ({ data, filename }) => {
        const publicId = (data as { cloudinaryPublicId?: string } | undefined)?.cloudinaryPublicId
        if (publicId) {
            return cloudinary.url(publicId, { secure: true })
        }
        return cloudinary.url(`${folder}/${filename}`, { secure: true })
    },
    staticHandler: () => new Response(null, { status: 404 }),
  }
}
