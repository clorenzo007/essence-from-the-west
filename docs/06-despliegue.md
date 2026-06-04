# Despliegue (Vercel + MongoDB Atlas)

## Checklist de producción

### 1. MongoDB Atlas

- Cluster creado, base de datos recomendada: **`essence`**
- **Network Access:** `0.0.0.0/0` (necesario para Vercel) o integración Vercel–Atlas
- Usuario con contraseña; URI formato:

```text
mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/essence?retryWrites=true&w=majority
```

### 2. Variables en Vercel (Production)

| Variable | Ejemplo / nota |
|----------|----------------|
| `DATABASE_URI` | URI de Atlas con `/essence` |
| `PAYLOAD_SECRET` | String largo aleatorio (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SERVER_URL` | `https://www.reservaoeste.com.ar` |
| `NEXT_PUBLIC_SITE_NAME` | `RESERVA OESTE` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ej: `54911xxxxxxxx` (sin +) |
| `PAYLOAD_COOKIE_DOMAIN` | Opcional: `.reservaoeste.com.ar` |
| `CLOUDINARY_*` | Si usás Cloudinary para media |

Tras cambiar variables → **Redeploy** (no basta con guardar).

### 3. Dominio

- Apuntar DNS a Vercel
- Preferir **www** como canónico; redirigir apex → www
- Usar siempre la misma URL para admin y cookies

### 4. GitHub → Vercel

Push a `main` en `clorenzo007/essence-from-the-west` dispara build.

`vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "regions": ["iad1"]
}
```

Build ejecuta: importmap → types → `next build`.

## Errores comunes en deploy

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Build falla en types | Falta `payload-types` | Ya resuelto: `generate:types` en build |
| `/admin` 500 | MongoDB bloqueado o URI mal | Atlas Network Access + `DATABASE_URI` |
| Sitio carga, catálogo 500 | Misma causa MongoDB | Idem |
| Logout no funciona | Cookies www/apex | `/api/cerrar-sesion` + `PAYLOAD_COOKIE_DOMAIN` |
| Imágenes rotas | URL de media | `NEXT_PUBLIC_SERVER_URL` correcto + Cloudinary |

## Desarrollo local

```bash
cp .env.example .env
npm install
npm run dev
```

MongoDB local:

```text
DATABASE_URI=mongodb://127.0.0.1:27017/essence
```

## Comandos útiles

| Comando | Cuándo usarlo |
|---------|----------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Probar build como Vercel |
| `npm run generate:types` | Tras cambiar colecciones |
| `npm run generate:importmap` | Tras cambiar admin/plugins |
| `npm run migrate:cloudinary` | Migrar imágenes a Cloudinary |

## Plan Hobby en Vercel

- **1 build concurrente:** no disparar muchos redeploys seguidos
- Cancelar builds en cola si hiciste push por error
