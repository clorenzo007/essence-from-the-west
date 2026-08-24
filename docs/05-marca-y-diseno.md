# Marca y diseño — Reserva Oeste

## Identidad

| Elemento | Valor |
|----------|--------|
| Nombre | RESERVA OESTE |
| Descriptor | Orquídeas de Colección |
| Tagline | Especies e híbridos seleccionados para coleccionistas y aficionados. |
| Dominio | https://www.reservaoeste.com.ar |

Constantes en `src/lib/constants.ts`.  
Logo: `public/images/logo.png` (no deformar ni recolorear).

## Paleta (Tailwind `ro.*`)

| Token | Hex | Uso |
|-------|-----|-----|
| `ro-gold` | #B08A43 | Botones, acentos, líneas |
| `ro-ivory` | #F7F4EF | Fondo general |
| `ro-card` | #FCFBF8 | Tarjetas, bloques |
| `ro-botanical` | #5D6A4D | Disponible, apoyo |
| `ro-charcoal` | #1F1F1F | Texto principal |
| `ro-orchid` | #B14679 | Detalle decorativo (poco) |
| `ro-muted` | #6B6B6B | Texto secundario |

## Tipografías

- **Títulos:** Cormorant Garamond (`font-display`)
- **Cuerpo:** Inter (`font-sans`)

## Principios de UI

- Mucho espacio en blanco, fotos grandes.
- Tarjetas de producto mínimas: foto, nombre, precio, disponibilidad.
- Sin estética marketplace (banners, badges, colores fuertes).
- Copy en **español** (Argentina): precios en ARS (`formatPrice` en `lib/utils.ts`).

## Hero (home)

Definido en `components/home/HeroSection.tsx`:

- Título: Orquídeas de Colección
- Botón principal: Ver Colección → `/catalog`
- Secundario: Conocer Reserva Oeste → `/#reserva`

## Cambiar colores globalmente

1. `tailwind.config.ts` → `theme.extend.colors.ro`
2. `app/globals.css` → clases `ro-*` si hace falta ajustar componentes

## Imágenes de marca

| Asset | Ruta | Uso |
|-------|------|-----|
| Logo | `public/images/logo.png` | Header / footer |
| Hero | `public/images/hero-orchid.svg` | Placeholder (reemplazar por foto real) |
| Editorial | `public/images/editorial-nursery.svg` | Sección #reserva |

En producción conviene subir fotos reales vía **Media** en Payload (Cloudinary).
