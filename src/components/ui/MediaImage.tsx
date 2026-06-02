import Image, { type ImageProps } from 'next/image'

import { isPayloadMediaUrl } from '@/lib/media'

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src: string
}

/** Payload CMS files are served via /api/media — bypass Next image optimizer. */
export function MediaImage({ src, ...props }: MediaImageProps) {
  return <Image src={src} unoptimized={isPayloadMediaUrl(src)} {...props} />
}
