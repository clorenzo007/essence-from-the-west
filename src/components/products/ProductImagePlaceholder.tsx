import Image from 'next/image'

import { PRODUCT_PLACEHOLDER_SRC } from '@/lib/constants'

/**
 * Reemplazo del antiguo recuadro blanco "Sin imagen": una foto real de la
 * colección, muy tenue y en escala de grises, para que un producto sin
 * foto cargada nunca se vea como un casillero vacío o roto.
 */
export function ProductImagePlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-ro-card">
      <Image
        src={PRODUCT_PLACEHOLDER_SRC}
        alt=""
        fill
        className="object-cover opacity-[0.14] grayscale"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <span className="ro-label relative z-10 text-ro-muted">Sin imagen</span>
    </div>
  )
}
