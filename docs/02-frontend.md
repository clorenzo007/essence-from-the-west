# Frontend (sitio público)

## Rutas

| URL | Archivo | Descripción |
|-----|---------|-------------|
| `/` | `app/(frontend)/page.tsx` | Home: hero, destacados, editorial, cuidado, CTA |
| `/catalog` | `catalog/page.tsx` | Listado con filtros GET (`q`, `difficulty`, `category`) |
| `/products/[slug]` | `products/[slug]/page.tsx` | Ficha de ejemplar + WhatsApp |
| `/care` | `care/page.tsx` | Índice de guías |
| `/care/[slug]` | `care/[slug]/page.tsx` | Guía individual |
| `/blog` | `blog/page.tsx` | Diario / blog |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Artículo |
| `/api/cerrar-sesion` | `api/cerrar-sesion/route.ts` | Borra cookies de admin y redirige a login |

Todas las páginas de datos usan `export const dynamic = 'force-dynamic'` porque leen MongoDB en cada request.

La home envuelve la consulta de destacados en `try/catch` para que la página cargue aunque MongoDB falle (lista vacía).

## Layout y estilos

**`app/(frontend)/layout.tsx`**

- Carga fuentes: Cormorant Garamond (`--font-cormorant`) + Inter (`--font-inter`).
- Metadata SEO con `SITE_NAME` y `SITE_TAGLINE` desde `lib/constants.ts`.
- `lang="es"`, Open Graph `es_AR`.

**`app/globals.css`**

Clases utilitarias de marca (prefijo `ro-` = Reserva Oeste):

| Clase | Uso |
|-------|-----|
| `ro-container` | Ancho máximo y padding horizontal |
| `ro-heading` | Títulos serif |
| `ro-label` | Etiquetas pequeñas uppercase |
| `ro-link` | Enlaces de navegación |
| `ro-button` | Botón principal dorado |
| `ro-button-ghost` | Botón secundario con borde |
| `payload-richtext` | Estilos para HTML de Lexical |

**`tailwind.config.ts`**

Colores `ro.gold`, `ro.ivory`, `ro.card`, `ro.botanical`, `ro.charcoal`, `ro.orchid`, `ro.muted`.

## Componentes

### Layout

| Componente | Archivo | Rol |
|------------|---------|-----|
| `Header` | `components/layout/Header.tsx` | Nav fija, menú móvil, CTA "Ver Colección" |
| `Logo` | `components/layout/Logo.tsx` | Imagen `public/images/logo.png` |
| `Footer` | `components/layout/Footer.tsx` | Logo, links, copyright |

### Home

| Componente | Rol |
|------------|-----|
| `HeroSection` | Foto hero, título "Orquídeas de Colección", CTAs |
| `FeaturedCollection` | Grid de productos `featured` + publicados |
| `EditorialStrip` | Bloque "Una colección, no un vivero" (`#reserva`) |
| `CarePreview` | Links a guías |
| `NewsletterCTA` | CTA WhatsApp / colección |

### Productos

| Componente | Rol |
|------------|-----|
| `ProductCard` | Solo foto, nombre, precio, Disponible/Agotado |
| `WhatsAppCheckoutButton` | Link `wa.me` con mensaje en español |
| `MediaImage` | `next/image` con `unoptimized` para URLs de Payload |

### UI

| Componente | Rol |
|------------|-----|
| `SectionHeading` | Título de sección + línea dorada |
| `RichTextContent` | Convierte JSON Lexical de Payload a HTML |

## Librerías (`src/lib/`)

| Módulo | Función |
|--------|---------|
| `constants.ts` | Nombre de marca, nav, URLs |
| `payload.ts` | `getPayloadClient()` |
| `products.ts` | `mapProductToCard`, `getProductSeo`, imagen principal |
| `content.ts` | Mappers para blog y care sheets |
| `media.ts` | URLs de media (Payload / Cloudinary), `isPayloadMediaUrl` |
| `site-images.ts` | Hero/editorial estáticos o Cloudinary |
| `utils.ts` | `formatPrice` (ARS), `slugify`, WhatsApp URL |
| `env.ts` | `getServerURL()` |
| `cloudinary.ts` | Config y helpers Cloudinary |

## Cómo agregar una sección nueva en la home

1. Crear `components/home/MiSeccion.tsx`.
2. Importar en `app/(frontend)/page.tsx`.
3. Si necesita datos, usar `getPayloadClient()` en la page (no en el componente cliente salvo que uses client component + API).

## Cómo cambiar textos de navegación

Editar `NAV_LINKS` y constantes en `src/lib/constants.ts`.
