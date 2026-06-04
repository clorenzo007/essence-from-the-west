import Image from 'next/image'
import Link from 'next/link'

import { LOGO_SRC, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  size?: 'header' | 'footer'
}

/**
 * Logo oficial de Reserva Oeste.
 * Sin sombras, filtros, rotación ni cambios de color.
 */
export function Logo({ className = '', size = 'header' }: LogoProps) {
  const sizeClass =
    size === 'footer' ? 'h-24 w-24 md:h-28 md:w-28' : 'h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]'

  return (
    <Link
      href="/"
      className={cn('inline-block shrink-0 p-1', className)}
      aria-label={`${SITE_NAME} — inicio`}
    >
      <Image
        src={LOGO_SRC}
        alt={SITE_NAME}
        width={512}
        height={512}
        className={cn(sizeClass, 'object-contain')}
        priority={size === 'header'}
        sizes={size === 'footer' ? '112px' : '72px'}
      />
    </Link>
  )
}
