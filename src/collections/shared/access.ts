import type { Access, Where } from 'payload'

type AuthUser = {
  id?: string
  role?: 'admin' | 'editor'
}

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => {
  const user = req.user as AuthUser | undefined
  return user?.role === 'admin'
}

/** Payload `access.admin` must return boolean only */
export const isAdminPanelUser = ({ req }: { req: { user?: AuthUser | null } }): boolean => {
  return req.user?.role === 'admin'
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
