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
    // c_/g_ only make sense together with w_/h_ — without a crop mode,
    // Cloudinary just constrains the image (no cropping), so a landscape
    // original gets served at its native aspect ratio and it's left to the
    // browser's CSS object-fit:cover to crop it, blindly, with no idea
    // where the actual subject is. That's what caused the product hero
    // image bug: a tall orchid photo forced into a 4:5 box ended up
    // showing only a sliver of the flower. Requesting the crop from
    // Cloudinary directly (crop:'fill', gravity:'auto') lets it pick the
    // interesting region instead.
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
