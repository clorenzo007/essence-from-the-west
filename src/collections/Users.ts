import type { CollectionConfig } from 'payload'

import { getAuthCookieDomain } from '@/lib/auth-cookies'

import { canAccessAdminPanel, isAdmin } from './shared/access'

const isProduction = process.env.NODE_ENV === 'production'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      domain: getAuthCookieDomain(),
      sameSite: 'Lax',
      secure: isProduction,
    },
    useSessions: true,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    admin: canAccessAdminPanel,
    create: isAdmin,
    read: ({ req }) => {
      const user = req.user as { id?: string; role?: string } | undefined
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    update: ({ req }) => {
      const user = req.user as { id?: string; role?: string } | undefined
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: isAdmin,
  },
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          where: { role: { equals: 'admin' } },
        })

        if (totalDocs === 0 && user.role !== 'admin') {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { role: 'admin' },
            req,
          })
          return { ...user, role: 'admin' as const }
        }

        return user
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (!data) return data

        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) {
            data.role = 'admin'
          }
        }

        if (!data.role) {
          data.role = 'editor'
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        read: () => true,
        create: ({ req }) => (req.user as { role?: string } | undefined)?.role === 'admin',
        update: async ({ req }) => {
          if ((req.user as { role?: string } | undefined)?.role === 'admin') return true
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'admin' } },
          })
          return totalDocs === 0
        },
      },
      admin: {
        description: 'Solo administradores pueden asignar roles. Cerrá sesión y volvé a entrar tras cambiar el tuyo.',
      },
    },
  ],
}
