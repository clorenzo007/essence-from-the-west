import type { Access, Where } from 'payload'

type AuthUser = {
  id?: string
  role?: 'admin' | 'editor'
}

// DIAGNOSTIC: isLoggedIn reverted to a simple synchronous "is there a
// session user" check (no live-DB 2FA verification lookup) to isolate
// whether the async DB-lookup version is what's breaking the Vercel build.
export const isLoggedIn: Access = ({ req }) => {
  return Boolean(req.user)
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
