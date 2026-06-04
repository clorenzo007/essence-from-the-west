import Image from 'next/image'

import { LOGO_SRC, SITE_NAME } from '@/lib/constants'

/** Logo en pantalla de login del admin (reemplaza marca Payload). */
export function AdminLogo() {
  return (
    <Image
      src={LOGO_SRC}
      alt={SITE_NAME}
      width={240}
      height={240}
      priority
      className="mx-auto h-auto w-[min(220px,70vw)] object-contain"
    />
  )
}
