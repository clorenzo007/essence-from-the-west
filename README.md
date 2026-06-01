# Essence From The West

Premium orchid nursery ecommerce — Next.js 15, Payload CMS 3, MongoDB, Tailwind CSS.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 App Router, React 19, TypeScript |
| CMS / Admin | Payload CMS 3 (embedded admin at `/admin`) |
| Database | MongoDB via `@payloadcms/db-mongodb` |
| Styling | Tailwind CSS — luxury botanical monochrome |

## Folder architecture

```
essence-from-the-west/
├── public/images/              # Static assets & placeholders
├── src/
│   ├── app/
│   │   ├── (frontend)/         # Public storefront (SSR)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── catalog/
│   │   │   ├── products/[slug]/
│   │   │   ├── care/
│   │   │   └── blog/
│   │   ├── (payload)/          # Payload admin + REST/GraphQL API
│   │   │   ├── admin/[[...segments]]/
│   │   │   └── api/
│   │   └── globals.css
│   ├── collections/            # Payload data models
│   ├── components/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── products/
│   │   └── ui/
│   ├── lib/                    # Payload client, utils, mappers
│   └── payload.config.ts       # MongoDB + collections
├── .env.example
└── package.json
```

## Collections (admin CRUD)

- **products** — catalog, stock, pricing, growing requirements, gallery
- **categories** — taxonomy for filters
- **blog-posts** — SEO journal
- **care-sheets** — orchid care guides
- **customers** — inquiry database (admin-only)
- **media** — image uploads with responsive sizes
- **users** — admin authentication

## Getting started

1. **MongoDB** — local or [MongoDB Atlas](https://www.mongodb.com/atlas):

   ```bash
   cp .env.example .env
   ```

   Set `DATABASE_URI`, `PAYLOAD_SECRET`, and optionally `NEXT_PUBLIC_WHATSAPP_NUMBER`.

2. **Install & run**:

   ```bash
   npm install
   npm run generate:importmap
   npm run dev
   ```

3. **Admin** — open [http://localhost:3000/admin](http://localhost:3000/admin) and create the first user.

4. **Storefront** — [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run generate:types` | Regenerate `payload-types.ts` |
| `npm run generate:importmap` | Regenerate admin import map |

## WhatsApp checkout

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (E.164 without `+`). Product pages link to a pre-filled WhatsApp message with name, price, and URL.

## Next steps

- Replace placeholder SVG hero art with nursery photography in **Media**
- Add `care/[slug]` and `blog/[slug]` detail templates
- `robots.txt` / sitemap generation
- Rich text rendering for product descriptions and blog posts
