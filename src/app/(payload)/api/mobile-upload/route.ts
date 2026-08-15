import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
   * Simple upload endpoint used by the mobile-friendly "Subir desde el celu"
   * page (/subir-fotos). Requires an existing Payload session (same cookie the
   * admin panel uses) and creates a plain Media doc, same as using the admin's
   * own "Create New" / "Bulk Upload" for Media, just with a lighter UI.
   */
export async function POST(req: Request) {
  const payload = await getPayload({ config })

const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json({ error: 'No autenticado. Iniciá sesión de nuevo.' }, { status: 401 })
  }

let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'No se pudo leer el formulario.' }, { status: 400 })
  }

const file = form.get('file')
  const alt = form.get('alt')
  const caption = form.get('caption')

if (!(file instanceof File)) {
  return Response.json({ error: 'Falta la foto.' }, { status: 400 })
}
  if (typeof alt !== 'string' || alt.trim().length === 0) {
    return Response.json({ error: 'Falta el texto alternativo (Alt).' }, { status: 400 })
  }
  if (file.size === 0) {
    return Response.json({ error: 'El archivo está vacío.' }, { status: 400 })
  }

const MAX_SIZE = 20 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'La foto pesa demasiado (máximo 20MB).' }, { status: 400 })
  }

const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

try {
  const doc = await payload.create({
    collection: 'media',
    data: {
      alt: alt.trim(),
      ...(typeof caption === 'string' && caption.trim().length > 0
          ? { caption: caption.trim() }
          : {}),
    },
    file: {
      data: buffer,
      mimetype: file.type || 'image/jpeg',
      name: file.name || 'foto.jpg',
      size: buffer.length,
    },
  })

  return Response.json({ id: doc.id, url: doc.url ?? null })
} catch (err) {
  const message = err instanceof Error ? err.message : 'Error desconocido al guardar la foto.'
  return Response.json({ error: message }, { status: 500 })
}
}
