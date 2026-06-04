import { LOGO_SRC } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BrandWatermarkProps = {
  className?: string
  /** fixed = visible al hacer scroll en toda la ventana; absolute = solo dentro del contenedor */
  variant?: 'fixed' | 'absolute'
  opacity?: number
}

/**
 * Marca de agua circular de Reserva Oeste.
 * Usar en layout, hero y secciones que necesiten el mismo look & feel.
 */
export function BrandWatermark({
  className,
  variant = 'fixed',
  opacity = 0.09,
}: BrandWatermarkProps) {
  return (
    <div
      className={cn(
        'pointer-events-none z-0',
        variant === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        className,
      )}
      aria-hidden
      style={{
        backgroundImage: `url(${LOGO_SRC})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 40%',
        backgroundSize: 'min(54vw, 520px)',
        opacity,
      }}
    />
  )
}
