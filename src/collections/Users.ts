import type { CollectionConfig, Endpoint, PayloadRequest } from 'payload'

import { getAuthCookieDomain } from '@/lib/auth-cookies'
import { getServerURL } from '@/lib/env'
import { inviteUserEmailHTML, inviteUserEmailSubject, otpEmailHTML, otpEmailSubject } from '@/lib/email-templates'
import { generateOtpCode, hashOtpCode, is2FADisabled, otpExpiryDate } from '@/lib/otp'

import { canAccessAdminPanel, isAdmin } from './shared/access'

const isProduction = process.env.NODE_ENV === 'production'

/** 7 días — pensado para invitaciones que pueden tardar en abrirse, no solo "olvidé mi clave". */
const INVITE_LINK_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7

async function sendOtpForUser(req: PayloadRequest, userId: string, email: string) {
  const code = generateOtpCode()
  const codeHash = hashOtpCode(code, userId)
  const expiresAt = otpExpiryDate().toISOString()

  await req.payload.update({
    collection: 'users',
    id: userId,
    data: { otpCodeHash: codeHash, otpExpiresAt: expiresAt, otpVerifiedAt: null },
    req,
  })

  try {
    await req.payload.sendEmail({
      to: email,
      subject: otpEmailSubject(),
      html: otpEmailHTML({ code }),
    })
  } catch (err) {
    req.payload.logger.error(`No se pudo enviar el código 2FA a ${email}: ${String(err)}`)
    throw err
  }
}

const verifyOtpEndpoint: Endpoint = {
  path: '/verify-otp',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'No autenticado.' }, { status: 401 })
    }

    if (is2FADisabled()) {
      return Response.json({ ok: true })
    }

    let body: { code?: unknown } = {}
    try {
      body = (await req.json?.()) ?? {}
    } catch {
      body = {}
    }
    const code = typeof body.code === 'string' ? body.code.trim() : ''

    if (!code) {
      return Response.json({ error: 'Ingresá el código que te enviamos por email.' }, { status: 400 })
    }

    const fresh = await req.payload.findByID({ collection: 'users', id: req.user.id, req })
    const storedHash: string | null | undefined = fresh?.otpCodeHash
    const storedExpiresAt: string | null | undefined = fresh?.otpExpiresAt

    if (!storedHash || !storedExpiresAt) {
      return Response.json(
        { error: 'No hay un código pendiente. Pedí uno nuevo.' },
        { status: 400 },
      )
    }

    if (new Date(storedExpiresAt).getTime() < Date.now()) {
      return Response.json({ error: 'El código venció. Pedí uno nuevo.' }, { status: 400 })
    }

    const expectedHash = hashOtpCode(code, String(req.user.id))
    if (expectedHash !== storedHash) {
      return Response.json({ error: 'Código incorrecto.' }, { status: 400 })
    }

    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: { otpVerifiedAt: new Date().toISOString(), otpCodeHash: null, otpExpiresAt: null },
      req,
    })

    return Response.json({ ok: true })
  },
}

const otpStatusEndpoint: Endpoint = {
  path: '/otp-status',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'No autenticado.' }, { status: 401 })
    }

    if (is2FADisabled()) {
      return Response.json({ required: false, verified: true })
    }

    const fresh = await req.payload.findByID({ collection: 'users', id: req.user.id, req })

    return Response.json({ required: true, verified: Boolean(fresh?.otpVerifiedAt) })
  },
}

const resendOtpEndpoint: Endpoint = {
  path: '/resend-otp',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'No autenticado.' }, { status: 401 })
    }

    if (is2FADisabled()) {
      return Response.json({ ok: true })
    }

    try {
      await sendOtpForUser(req, String(req.user.id), String(req.user.email))
    } catch {
      return Response.json(
        { error: 'No se pudo enviar el email. Probá de nuevo en un momento.' },
        { status: 500 },
      )
    }

    return Response.json({ ok: true })
  },
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      domain: getAuthCookieDomain(),
      sameSite: 'Lax',
      secure: isProduction,
    },
    useSessions: true,
    forgotPassword: {
      expiration: INVITE_LINK_EXPIRATION_MS,
      generateEmailSubject: () => inviteUserEmailSubject(),
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const setPasswordUrl = `${getServerURL()}/admin/reset/${token}`
        return inviteUserEmailHTML({ setPasswordUrl })
      },
    },
  },
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administración',
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
  endpoints: [otpStatusEndpoint, verifyOtpEndpoint, resendOtpEndpoint],
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        let current = user

        const { totalDocs } = await req.payload.count({
          collection: 'users',
          where: { role: { equals: 'admin' } },
        })

        if (totalDocs === 0 && current.role !== 'admin') {
          await req.payload.update({
            collection: 'users',
            id: current.id,
            data: { role: 'admin' },
            req,
          })
          current = { ...current, role: 'admin' as const }
        }

        if (is2FADisabled()) {
          return current
        }

        // El código de acceso (2FA) se pide una única vez por usuario — la
        // primera vez que inicia sesión — no en cada login. Una vez
        // verificado, `otpVerifiedAt` queda guardado para siempre (hasta que
        // se resetee a mano en la base), así que logins posteriores no
        // reenvían ni vuelven a pedir el código. Se consulta el valor fresco
        // en la base (no el JWT/sesión) por la misma razón que `isLoggedIn`
        // en shared/access.ts.
        const fresh = await req.payload.findByID({ collection: 'users', id: current.id, req })
        if (fresh?.otpVerifiedAt) {
          return current
        }

        try {
          await sendOtpForUser(req, current.id, current.email)
        } catch {
          // El login igual continúa — verify-otp/resend-otp le permiten reintentar.
        }

        return { ...current, otpVerifiedAt: null }
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        // No invitar al primer usuario (bootstrap del sitio): esa persona ya
        // eligió su propia contraseña en la pantalla de creación de cuenta.
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
        { label: 'Administrador', value: 'admin' },
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
    {
      name: 'otpCodeHash',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => false, create: () => false, update: () => false },
    },
    {
      name: 'otpExpiresAt',
      type: 'date',
      admin: { hidden: true },
      access: { read: () => false, create: () => false, update: () => false },
    },
    {
      name: 'otpVerifiedAt',
      type: 'date',
      admin: { hidden: true },
      access: { read: () => false, create: () => false, update: () => false },
    },
  ],
}
