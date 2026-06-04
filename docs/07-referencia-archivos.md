# Referencia de archivos

Mapa del código fuente. Rutas relativas a la raíz del repo.

## Raíz del proyecto

| Archivo | Descripción |
|---------|-------------|
| `package.json` | Dependencias y scripts |
| `next.config.ts` | Next + Payload (`withPayload`), imágenes, `serverExternalPackages` |
| `tailwind.config.ts` | Colores `ro`, fuentes |
| `postcss.config.mjs` | PostCSS para Tailwind |
| `tsconfig.json` | Paths `@/*` → `src/*` |
| `vercel.json` | Build y región Vercel |
| `.env.example` | Plantilla de variables |
| `.gitignore` | Ignora `.env`, `payload-types.ts`, `.next`, `media/` |

## `public/`

| Archivo | Descripción |
|---------|-------------|
| `images/logo.png` | Logo oficial Reserva Oeste |
| `images/hero-orchid.svg` | Placeholder hero |
| `images/editorial-nursery.svg` | Placeholder editorial |

## `src/app/`

### Globales

| Archivo | Descripción |
|---------|-------------|
| `globals.css` | Estilos Tailwind + clases `ro-*` + rich text |

### `(frontend)/` — Sitio público

| Archivo | Descripción |
|---------|-------------|
| `layout.tsx` | HTML, fuentes, Header/Footer, metadata |
| `page.tsx` | Homepage |
| `catalog/page.tsx` | Catálogo + formulario filtros |
| `products/[slug]/page.tsx` | Ficha producto |
| `care/page.tsx` | Listado guías |
| `care/[slug]/page.tsx` | Guía detalle |
| `blog/page.tsx` | Listado blog |
| `blog/[slug]/page.tsx` | Post detalle |
| `api/cerrar-sesion/route.ts` | Logout forzado |

### `(payload)/` — CMS

| Archivo | Descripción |
|---------|-------------|
| `layout.tsx` | RootLayout Payload + server functions |
| `custom.scss` | Tema admin |
| `admin/[[...segments]]/page.tsx` | UI admin |
| `admin/importMap.js` | Import map (generado) |
| `api/[...slug]/route.ts` | REST API Payload |
| `api/graphql/route.ts` | GraphQL |
| `api/graphql-playground/route.ts` | Playground |

## `src/collections/`

| Archivo | Descripción |
|---------|-------------|
| `Users.ts` | Auth, roles, cookies, hooks login |
| `Media.ts` | Upload imágenes + alt |
| `Products.ts` | Orquídeas (tabs, hooks, acceso) |
| `Categories.ts` | Categorías |
| `BlogPosts.ts` | Blog |
| `CareSheets.ts` | Guías cuidado |
| `Customers.ts` | Clientes / consultas |
| `shared/access.ts` | Permisos reutilizables |
| `shared/fields.ts` | Slug, SEO, hooks meta |
| `shared/options.ts` | Enums compartidos |
| `products/hooks.ts` | Validación publicación, slug |
| `products/options.ts` | Opciones select producto |
| `blog-posts/hooks.ts` | Validación blog |
| `care-sheets/hooks.ts` | Validación care |
| `categories/hooks.ts` | Validación categorías |

## `src/components/`

| Archivo | Descripción |
|---------|-------------|
| `layout/Header.tsx` | Cabecera |
| `layout/Footer.tsx` | Pie |
| `layout/Logo.tsx` | Logo imagen |
| `home/HeroSection.tsx` | Hero |
| `home/FeaturedCollection.tsx` | Destacados |
| `home/EditorialStrip.tsx` | Bloque marca |
| `home/CarePreview.tsx` | Preview guías |
| `home/NewsletterCTA.tsx` | CTA consulta |
| `products/ProductCard.tsx` | Tarjeta catálogo |
| `products/WhatsAppCheckoutButton.tsx` | Botón WhatsApp |
| `ui/SectionHeading.tsx` | Título sección |
| `ui/MediaImage.tsx` | Imagen con alt obligatorio |
| `ui/RichTextContent.tsx` | HTML desde Lexical |

## `src/lib/`

| Archivo | Descripción |
|---------|-------------|
| `payload.ts` | Cliente Payload |
| `constants.ts` | Marca, nav, logo path |
| `env.ts` | URL del servidor |
| `auth-cookies.ts` | Dominio cookie, CSRF, limpiar sesión |
| `utils.ts` | Precio ARS, slugify, WhatsApp |
| `products.ts` | Mappers producto |
| `content.ts` | Mappers blog/care |
| `media.ts` | URLs y alt de media |
| `cloudinary.ts` | Config Cloudinary |
| `site-images.ts` | URLs imágenes estáticas del sitio |

## `src/storage/`

| Archivo | Descripción |
|---------|-------------|
| `cloudinaryAdapter.ts` | Adaptador upload Cloudinary |

## Configuración Payload

| Archivo | Descripción |
|---------|-------------|
| `payload.config.ts` | Config principal |
| `payload-types.ts` | Tipos generados (no commitear) |

## `scripts/`

| Archivo | Descripción |
|---------|-------------|
| `migrate-media-to-cloudinary.ts` | Migración de imágenes a Cloudinary |

## Flujo: agregar un campo a Productos

1. Editar `src/collections/Products.ts` (nuevo field).
2. `npm run generate:types`.
3. Si el campo va al storefront, actualizar `payload-types` usage en `lib/products.ts` o páginas.
4. Probar en `/admin` y en `/products/[slug]`.
5. Commit (incluir `importMap.js` solo si cambió admin).

## Flujo: publicar un ejemplar en la web

1. Admin → Orchids → crear/editar.
2. Completar galería, precio, descripciones.
3. `status` → **Published**, opcional **Featured** para home.
4. Guardar → visible en `/catalog` y slug `/products/...`.
