import type { CollectionConfig } from 'payload'

import { getAuthCookieDomain } from '@/lib/auth-cookies'
import { getServerURL } from '@/lib/env'
import { inviteUserEmailHTML, inviteUserEmailSubject } from '@/lib/email-templates'

import { canAccessAdminPanel, isAdmin } from './shared/access'

const isProduction = process.env.NODE_ENV === 'production'

const INVITE_LINK_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7

// DIAGNOSTIC: 2FA/OTP subsystem entirely removed (endpoints, hooks, fields,
// afterLogin OTP send) to isolate whether the OTP code is what's breaking
// the Vercel build. Only the invite-by-email password-setup flow remains.
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: { domain: getAuthCookieDomain(), sameSite: 'Lax', secure: isProduction },
    useSessions: true,
    forgotPassword: {
      expiration: INVITE_LINK_EXPIRATION_MS,
      generateEmailSubject: () => inviteUserEmailSubject(),
      generateEmailHTML: ({ token }) => {
        const setPasswordUrl = `${getServerURL()}/admin/reset/${token}`
        return inviteUserEmailHTML({ setPasswordUrl })
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description:
      'Al crear un usuario se le envía un email para que configure su propia contraseña — la contraseña que ingreses acá es solo temporal y se descarta.',
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
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const { totalDocs } = await req.payload.count({ collection: 'users' })
        if (totalDocs <= 1) return

        try {
          await req.payload.forgotPassword({
            collection: 'users',
            data: { email: doc.email },
            req,
            disableEmail: false,
          })
        } catch (err) {
          req.payload.logger.error(
            `No se pudo enviar el email de invitación a ${doc.email}: ${String(err)}`,
          )
        }
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
    { name: 'name', type: 'text' },
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
