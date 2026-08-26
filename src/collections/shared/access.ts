import type { Access, Where } from 'payload'

type AuthUser = {
  id?: string
  role?: 'admin' | 'editor'
}

/**
 * Requiere sesión Y (si el 2FA por email está activo) el código de acceso
 * ya verificado en ESTA sesión. Se hace una consulta directa a la base de
 * datos en cada chequeo — deliberado: preferimos esto a confiar en datos
 * potencialmente desactualizados guardados en el JWT/sesión.
 *
 * Solo se usa para crear/editar/borrar contenido (ver editorCollectionAccess
 * y Media más abajo). A propósito NO se usa en `canAccessAdminPanel` ni en
 * `publishedReadAccess.read`, así el panel de administración y la pantalla
 * para ingresar el código siempre son alcanzables — en el peor caso alguien
 * queda en "solo lectura" hasta verificar el código, nunca bloqueado afuera.
 *
 * DISABLE_2FA=true en las variables de entorno desactiva este chequeo por
 * completo (llave de emergencia).
 */
export const isLoggedIn: Access = async ({ req }) => {
  if (!req.user) return false

  if (process.env.DISABLE_2FA === 'true') return true

  try {
    const fresh = await req.payload.findByID({
      collection: 'users',
      id: req.user.id,
      req,
    })
    return Boolean(fresh?.otpVerifiedAt)
  } catch {
    return false
  }
}

export const isAdmin: Access = ({ req }) => {
  const user = req.user as AuthUser | undefined
  return user?.role === 'admin'
}

/** Payload `access.admin` on the auth collection — editors and admins may use the panel */
export const canAccessAdminPanel = ({ req }: { req: { user?: AuthUser | null } }): boolean => {
  const role = req.user?.role
  return role === 'admin' || role === 'editor'
}

export const publishedReadAccess: { read: Access } = {
  read: ({ req }) => {
    if (req.user) return true
    return { status: { equals: 'published' } } as Where
  },
}

/** CMS editors and admins can manage content in the admin panel */
export const editorCollectionAccess = {
  read: publishedReadAccess.read,
  create: isLoggedIn,
  update: isLoggedIn,
  delete: isLoggedIn,
}
