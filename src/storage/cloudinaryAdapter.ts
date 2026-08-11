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
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
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
    generateURL: ({ filename, data }) => {
      const publicId = (data as { cloudinaryPublicId?: string } | undefined)?.cloudinaryPublicId
      return cloudinary.url(publicId || `${folder}/${filename}`, { secure: true })
    },
    staticHandler: () => new Response(null, { status: 404 }),
  }
}
