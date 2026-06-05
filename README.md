# Reserva Oeste

**Orquídeas de Colección** — sitio editorial + catálogo con checkout por WhatsApp.

Stack: **Next.js 15** · **Payload CMS 3** · **MongoDB** · **Tailwind** · **Cloudinary** (opcional).

| Entorno | URL |
|---------|-----|
| Producción | https://www.reservaoeste.com.ar |
| Admin | https://www.reservaoeste.com.ar/admin |
| Repo | https://github.com/clorenzo007/essence-from-the-west |

## Documentación

Toda la guía del código está en **[docs/](./docs/)**:

- [Índice](./docs/README.md)
- [Arquitectura](./docs/01-arquitectura.md)
- [Frontend](./docs/02-frontend.md)
- [Payload CMS](./docs/03-payload-cms.md)
- [Autenticación](./docs/04-autenticacion.md)
- [Marca y diseño](./docs/05-marca-y-diseno.md)
- [Despliegue](./docs/06-despliegue.md)
- [Referencia de archivos](./docs/07-referencia-archivos.md)
- [Alta de productos](./docs/08-alta-de-productos.md)

## Inicio rápido

```bash
cp .env.example .env
# DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL
npm install
npm run dev
```

- Tienda: http://localhost:3000  
- Admin: http://localhost:3000/admin  

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción (importmap + types + Next) |
| `npm run generate:types` | Regenerar `payload-types.ts` |
| `npm run generate:importmap` | Regenerar mapa del admin |
| `npm run migrate:cloudinary` | Subir media a Cloudinary |

## Estructura resumida

```
src/app/(frontend)/   → Sitio público
src/app/(payload)/    → Admin + API
src/collections/      → Modelos Payload
src/components/       → UI React
src/lib/              → Payload client, mappers, utilidades
```

## Ayuda rápida

| Problema | Solución |
|----------|----------|
| No puedo entrar al admin | Ver [04-autenticacion.md](./docs/04-autenticacion.md) |
| Logout no funciona | https://www.reservaoeste.com.ar/api/cerrar-sesion |
| Deploy falla | Ver [06-despliegue.md](./docs/06-despliegue.md) |
