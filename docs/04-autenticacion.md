# Autenticación y usuarios

## Roles

| Rol | Panel `/admin` | Gestionar usuarios | Gestionar contenido |
|-----|----------------|--------------------|---------------------|
| `admin` | Sí | Sí (crear, borrar, cambiar roles) | Sí |
| `editor` | Sí | Solo su propio perfil | Sí |

Configuración en `src/collections/Users.ts`.

## Campo `role`

- Tipo `select`: `admin` | `editor`
- **`saveToJWT: true`** — el rol viaja en la cookie/JWT (necesario para permisos)
- Solo un **admin** puede asignar roles a otros
- **Excepción:** si no existe ningún admin en la base, el primer usuario puede asignarse admin al editar su perfil

## Bootstrap del primer admin

1. **Al crear** el primer usuario en BD → hook `beforeChange` fuerza `role: admin`.
2. **Al hacer login** si no hay admins → hook `afterLogin` actualiza el usuario a `admin` en MongoDB.
3. Tras cambio de rol: **cerrar sesión y volver a entrar** para refrescar el JWT.

## Cookies en producción

`src/lib/auth-cookies.ts` + config en `Users.auth.cookies`:

- `secure: true` en producción
- `sameSite: Lax`
- `domain: .reservaoeste.com.ar` (derivado de `NEXT_PUBLIC_SERVER_URL` o `PAYLOAD_COOKIE_DOMAIN`)

`payload.config.ts` define `csrf` y `cors` con orígenes:

- `https://www.reservaoeste.com.ar`
- `https://reservaoeste.com.ar`
- `http://localhost:3000`

## Problemas frecuentes

### "Unauthorized, this user does not have access to the admin panel"

- El JWT no tiene rol válido o el usuario es `editor` cuando la config vieja solo permitía `admin`.
- Solución: deploy actualizado + logout + login. O setear `role: admin` en MongoDB.

### Logout no cierra sesión

- Cookies duplicadas (www vs sin www) o cookie vieja sin dominio.
- **Solución inmediata:** abrir  
  **https://www.reservaoeste.com.ar/api/cerrar-sesion**  
  Implementado en `app/(frontend)/api/cerrar-sesion/route.ts`.

### Cambié rol pero sigo viendo permisos viejos

- El token guarda el rol hasta que cerrás sesión.
- Siempre: **Log out → Log in** (o `/api/cerrar-sesion`).

## Editar tu usuario en MongoDB Atlas

Colección `users`, documento por email:

```json
{ "$set": { "role": "admin" } }
```

Luego `/api/cerrar-sesion` y login de nuevo.

## Archivos relacionados

| Archivo | Rol |
|---------|-----|
| `collections/Users.ts` | Modelo, hooks, acceso |
| `collections/shared/access.ts` | Helpers de permisos |
| `lib/auth-cookies.ts` | Dominio cookie, CSRF, limpiar sesión |
