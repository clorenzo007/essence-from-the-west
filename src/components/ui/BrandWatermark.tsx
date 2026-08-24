import { SITE_WATERMARK_SRC } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BrandWatermarkProps = {
  className?: string
  /** fixed = visible al hacer scroll en toda la ventana; absolute = solo dentro del contenedor */
  variant?: 'fixed' | 'absolute'
  opacity?: number
}

/**
 * Marca de agua fotográfica de Reserva Oeste — una orquídea real de la
 * colección, en escala de grises y muy baja opacidad para no competir
 * con el contenido. Usar en layout, hero y secciones que necesiten el
 * mismo look & feel.
 */
export function BrandWatermark({
  className,
  variant = 'fixed',
  opacity = 0.08,
}: BrandWatermarkProps) {
  return (
    <div
      className={cn(
        'pointer-events-none z-0 grayscale',
        variant === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        className,
      )}
      aria-hidden
      style={{
        backgroundImage: `url(${SITE_WATERMARK_SRC})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 38%',
        backgroundSize: 'min(80vw, 1100px)',
        opacity,
      }}
    />
  )
}
