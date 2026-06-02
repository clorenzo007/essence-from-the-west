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
  options?: { width?: number; height?: number; quality?: string },
) {
  const { cloudName } = getCloudinaryConfig()
  if (!cloudName) return null

  const transforms = [
    'f_auto',
    'q_auto',
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.quality && `q_${options.quality}`,
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}
