import Image, { type ImageProps } from 'next/image'

import { isPayloadMediaUrl } from '@/lib/media'

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src: string
  alt: string
}

/** Payload CMS files are served via /api/media — bypass Next image optimizer. */
export function MediaImage({ src, alt, ...props }: MediaImageProps) {
  return <Image src={src} alt={alt} unoptimized={isPayloadMediaUrl(src)} {...props} />
}
