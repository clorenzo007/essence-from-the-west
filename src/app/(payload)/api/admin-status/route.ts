import config from '@payload-config'
import { getPayload } from 'payload'

import { isCloudinaryEnabled } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

type CheckResult = { ok: boolean; detail: string }

/**
 * Admin-only health check for the status bar shown in `/admin`.
 * Never exposed publicly: requires a logged-in Payload session.
 */
export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const database: CheckResult = await (async () => {
    try {
      await payload.count({ collection: 'users' })
      return { ok: true, detail: 'Conectado a MongoDB.' }
    } catch {
      return { ok: false, detail: 'No se pudo conectar a MongoDB. El sitio y el admin pueden estar caídos.' }
    }
  })()

  const media: CheckResult = (() => {
    if (isCloudinaryEnabled()) {
      return { ok: true, detail: 'Cloudinary configurado.' }
    }
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      return { ok: true, detail: 'Vercel Blob configurado (sin Cloudinary).' }
    }
    return {
      ok: false,
      detail:
        'Sin Cloudinary ni Vercel Blob configurados: la subida de fotos va a fallar en producción.',
    }
  })()

  const whatsapp: CheckResult = (() => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    if (number && number.trim().length > 0) {
      return { ok: true, detail: `Número configurado (…${number.slice(-4)}).` }
    }
    return {
      ok: false,
      detail: 'Falta NEXT_PUBLIC_WHATSAPP_NUMBER: el botón de WhatsApp no va a funcionar en el sitio.',
    }
  })()

  return Response.json({ database, media, whatsapp, checkedAt: new Date().toISOString() })
}
