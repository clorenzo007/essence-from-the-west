import Image from 'next/image'

import { LOGO_SRC, SITE_NAME } from '@/lib/constants'

/** Ícono en la barra lateral del admin (reemplaza ícono Payload). */
export function AdminIcon() {
  return (
    <Image
      src={LOGO_SRC}
      alt={SITE_NAME}
      width={40}
      height={40}
      className="h-9 w-9 object-contain"
    />
  )
}
