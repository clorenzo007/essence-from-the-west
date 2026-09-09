export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'essence-from-the-west',
  }
}

export function isCloudinaryEnabled() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()
  return Boolean(cloudName && apiKey && apiSecret)
}

export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: string
    /** Cloudinary crop mode, e.g. 'fill'. Only applied together with width+height. */
    crop?: string
    /** Cloudinary gravity, e.g. 'auto' (subject-aware) or 'center'. */
    gravity?: string
  },
) {
  const { cloudName } = getCloudinaryConfig()
  if (!cloudName) return null

  const transforms = [
    'f_auto',
    'q_auto',
    // c_/g_ only make sense together with w_/h_. Product photos pass
    // crop:'fit' (no gravity needed) so Cloudinary scales the whole image
    // down to fit inside the box without cropping anything out — see
    // getMediaUrl for why: a smart center-of-subject crop (fill + auto
    // gravity) still cut into the photo, which isn't what was wanted.
    options?.width && options?.height && options?.crop && `c_${options.crop}`,
    options?.width && options?.height && options?.gravity && `g_${options.gravity}`,
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.quality && `q_${options.quality}`,
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}
