# Documentación — Reserva Oeste

Guías para entender y mantener el proyecto **essence-from-the-west** (marca pública: **RESERVA OESTE**).

| Documento | Contenido |
|-----------|-----------|
| [01-arquitectura.md](./01-arquitectura.md) | Cómo está armado Next.js + Payload + MongoDB |
| [02-frontend.md](./02-frontend.md) | Rutas públicas, componentes, estilos |
| [03-payload-cms.md](./03-payload-cms.md) | Colecciones, hooks, media, API |
| [04-autenticacion.md](./04-autenticacion.md) | Usuarios, roles, login, logout |
| [05-marca-y-diseno.md](./05-marca-y-diseno.md) | Colores, tipografías, copy |
| [06-despliegue.md](./06-despliegue.md) | Vercel, variables, dominios |
| [07-referencia-archivos.md](./07-referencia-archivos.md) | Mapa archivo por archivo |

## Inicio rápido

```bash
cd ~/Projects/essence-from-the-west
cp .env.example .env
# Editar .env: DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL
npm install
npm run dev
```

- Tienda: http://localhost:3000  
- Admin: http://localhost:3000/admin  
- Cerrar sesión forzada: http://localhost:3000/api/cerrar-sesion  

## Repositorio y producción

- **GitHub:** https://github.com/clorenzo007/essence-from-the-west  
- **Producción:** https://www.reservaoeste.com.ar  
- **Admin:** https://www.reservaoeste.com.ar/admin  
