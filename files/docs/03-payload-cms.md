# Payload CMS

## Panel de administración

- **URL local:** http://localhost:3000/admin  
- **Producción:** https://www.reservaoeste.com.ar/admin  
- **API REST:** `/api/[...slug]` → manejada por `@payloadcms/next/routes`

Archivos clave del admin:

| Archivo | Rol |
|---------|-----|
| `app/(payload)/layout.tsx` | Layout Payload + `handleServerFunctions` |
| `app/(payload)/admin/[[...segments]]/page.tsx` | Todas las rutas del admin |
| `app/(payload)/admin/importMap.js` | Mapa de componentes (generado, commiteado) |
| `app/(payload)/custom.scss` | Tema claro del admin acorde a marca |
| `app/(payload)/api/[...slug]/route.ts` | GET/POST/PATCH/DELETE de la API |

Regenerar import map tras cambiar plugins o campos custom del admin:

```bash
npm run generate:importmap
```

## Colecciones

Definidas en `src/collections/` e importadas en `payload.config.ts`.

| Slug | Archivo | Uso en la web |
|------|---------|---------------|
| `users` | `Users.ts` | Login admin |
| `media` | `Media.ts` | Imágenes (upload) |
| `categories` | `Categories.ts` | Taxonomía de orquídeas |
| `products` | `Products.ts` | Catálogo y fichas |
| `specimens` | `Specimens.ts` | Bitácora interna de cultivo por planta (privada, no pública) |
| `blog-posts` | `BlogPosts.ts` | Diario |
| `care-sheets` | `CareSheets.ts` | Guías de cultivo |
| `customers` | `Customers.ts` | Base de consultas (solo admin) |

### Products (la más grande)

`Products.ts` organiza campos en **tabs**:

- Detalles (nombre, especie, híbrido, descripciones Lexical)
- Cultivo (humedad, luz, dificultad, etc.)
- Comercio (precio, stock, moneda)
- Galería (relación a `media`, imagen principal)
- SEO (meta título, descripción, OG)

**Sidebar:** `status` (draft/published/archived), `featured`, `slug`, `sku`.

**Hooks** (`collections/products/hooks.ts`):

- `autoGenerateSlug` — slug desde nombre
- `validatePublishedProduct` — campos obligatorios si está publicado
- `syncMetaFromProduct` — rellena SEO si falta

Solo los productos con `status: published` aparecen en la web pública.

### Campos compartidos

`collections/shared/fields.ts`:

- `createSlugField()` — slug con validación
- `createSeoTabFields()` — pestaña SEO reutilizable
- `createMetaSyncHook()` — sincroniza meta desde título/descripción

`collections/shared/options.ts` — enums (dificultad, fragancia, estaciones, etc.).

### Control de acceso

`collections/shared/access.ts`:

| Helper | Significado |
|--------|-------------|
| `isLoggedIn` | Usuario autenticado en Payload |
| `isAdmin` | Rol `admin` |
| `canAccessAdminPanel` | Rol `admin` o `editor` (entrada al panel) |
| `publishedReadAccess` | Público solo lee `published`; logueados leen todo |
| `editorCollectionAccess` | Lectura pública filtrada + CRUD para logueados |

## Rich text (Lexical)

Editor: `@payloadcms/richtext-lexical` en `payload.config.ts`.

En el frontend, `RichTextContent` usa `convertLexicalToHTML` de Payload para mostrar descripciones y artículos.

## Tipos TypeScript

`src/payload-types.ts` se genera con:

```bash
npm run generate:types
```

Está en `.gitignore` localmente; en Vercel se crea durante `npm run build`.

Importar tipos así:

```ts
import type { Product } from '@/payload-types'
```

## GraphQL (opcional)

- `/api/graphql` — API GraphQL  
- `/api/graphql-playground` — playground en desarrollo  

El storefront actual usa solo REST vía `getPayloadClient()`, no GraphQL.

## Script de migración a Cloudinary

```bash
npm run migrate:cloudinary
```

Sube archivos de `media/` y `public/images/` a Cloudinary. Requiere variables `CLOUDINARY_*` en `.env`.
