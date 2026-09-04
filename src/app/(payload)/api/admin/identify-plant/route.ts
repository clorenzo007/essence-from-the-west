import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
 * Admin-only proxy to the Pl@ntNet identification API
 * (https://my.plantnet.org/doc/api/identify). Keeps PLANTNET_API_KEY
 * server-side only — the admin UI never sees it.
 *
 * Used by the "Identificar" button on the Products create/edit form
 * (see src/components/admin/IdentifyPlantField.tsx) to suggest a
 * genus/species from a photo. Requires a logged-in Payload admin
 * session, same gating as the other /api/admin/* endpoints.
 *
 * Accepts multipart/form-data with either:
 *  - `image`: a raw file (manual upload), or
 *  - `mediaId`: the id of a doc already in the `media` collection (e.g.
 *    a photo already added to the product's gallery) — the file is
 *    fetched server-side from its stored URL, so nothing needs to be
 *    uploaded twice.
 */

const PLANTNET_ENDPOINT = 'https://my-api.plantnet.org/v2/identify/all'

// Vercel Serverless Functions (Node runtime) cap request bodies around
// 4.5MB — reject earlier with a clear message instead of a generic 413.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

type PlantnetSpecies = {
  scientificNameWithoutAuthor?: string
  scientificName?: string
  commonNames?: string[]
  genus?: { scientificNameWithoutAuthor?: string; scientificName?: string }
  family?: { scientificNameWithoutAuthor?: string; scientificName?: string }
}

type PlantnetResult = {
  score: number
  species: PlantnetSpecies
}

type PlantnetResponse = {
  results?: PlantnetResult[]
  remainingIdentificationRequests?: number
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json(
      { error: 'No autenticado. Iniciá sesión en /admin y volvé a intentar.' },
      { status: 401 },
    )
  }

  const apiKey = process.env.PLANTNET_API_KEY
  if (!apiKey) {
    return Response.json(
      {
        error:
          'La identificación automática todavía no está configurada: falta la variable de entorno PLANTNET_API_KEY en el servidor.',
      },
      { status: 503 },
    )
  }

  let incomingForm: FormData
  try {
    incomingForm = await req.formData()
  } catch {
    return Response.json({ error: 'No se pudo leer la imagen enviada.' }, { status: 400 })
  }

  const directImage = incomingForm.get('image')
  const mediaId = incomingForm.get('mediaId')

  let imageBlob: Blob | File
  let imageFilename = 'photo.jpg'

  if (directImage instanceof File && directImage.size > 0) {
    if (!directImage.type.startsWith('image/')) {
      return Response.json({ error: 'El archivo tiene que ser una imagen.' }, { status: 400 })
    }
    if (directImage.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: 'La foto pesa demasiado (máximo 4MB). Probá con una versión más liviana.' },
        { status: 413 },
      )
    }
    imageBlob = directImage
    imageFilename = directImage.name || imageFilename
  } else if (typeof mediaId === 'string' && mediaId.trim()) {
    let mediaDoc: { url?: string | null; filename?: string | null } | null = null
    try {
      mediaDoc = await payload.findByID({ collection: 'media', id: mediaId })
    } catch {
      return Response.json({ error: 'No se encontró la foto seleccionada.' }, { status: 404 })
    }

    if (!mediaDoc?.url) {
      return Response.json({ error: 'La foto seleccionada no tiene una URL válida.' }, { status: 404 })
    }

    const mediaUrl = mediaDoc.url.startsWith('http')
      ? mediaDoc.url
      : new URL(mediaDoc.url, req.url).toString()

    let mediaRes: Response
    try {
      mediaRes = await fetch(mediaUrl)
    } catch {
      return Response.json({ error: 'No se pudo descargar la foto seleccionada.' }, { status: 502 })
    }

    if (!mediaRes.ok) {
      return Response.json({ error: 'No se pudo descargar la foto seleccionada.' }, { status: 502 })
    }

    const contentLength = Number(mediaRes.headers.get('content-length') || 0)
    if (contentLength > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: 'La foto pesa demasiado (máximo 4MB). Probá con una versión más liviana.' },
        { status: 413 },
      )
    }

    imageBlob = await mediaRes.blob()
    if (imageBlob.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: 'La foto pesa demasiado (máximo 4MB). Probá con una versión más liviana.' },
        { status: 413 },
      )
    }
    imageFilename = mediaDoc.filename || imageFilename
  } else {
    return Response.json({ error: 'Falta la foto a identificar.' }, { status: 400 })
  }

  const outgoingForm = new FormData()
  outgoingForm.append('images', imageBlob, imageFilename)
  outgoingForm.append('organs', 'auto')

  const trimmedKey = apiKey.trim()

  const url = new URL(PLANTNET_ENDPOINT)
  // .trim() por si la key se pegó con un espacio o salto de línea de más al
  // configurarla en Vercel — eso alcanza para que Pl@ntNet la rechace.
  url.searchParams.set('api-key', trimmedKey)
  url.searchParams.set('lang', 'es')
  url.searchParams.set('nb-results', '5')

  // Diagnóstico temporal: nunca logueamos la key completa, solo su forma
  // (largo + primeros/últimos caracteres) para poder compararla con la que
  // figura en my.plantnet.org sin exponerla. También logueamos qué le
  // estamos mandando a Pl@ntNet (tamaño/tipo de la imagen) para descartar
  // que el archivo llegue corrupto o sin content-type.
  payload.logger.info(
    `[identify-plant] enviando a Pl@ntNet: key.length=${trimmedKey.length} key.head="${trimmedKey.slice(0, 4)}" key.tail="${trimmedKey.slice(-4)}" image.size=${imageBlob.size} image.type="${imageBlob.type}" filename="${imageFilename}"`,
  )

  let plantnetRes: Response
  try {
    plantnetRes = await fetch(url.toString(), {
      method: 'POST',
      body: outgoingForm,
    })
  } catch {
    return Response.json(
      { error: 'No se pudo contactar al servicio de identificación. Probá de nuevo en un momento.' },
      { status: 502 },
    )
  }

  if (plantnetRes.status === 401 || plantnetRes.status === 403) {
    return Response.json(
      { error: 'La API key de Pl@ntNet configurada no es válida.' },
      { status: 502 },
    )
  }

  if (plantnetRes.status === 429) {
    return Response.json(
      {
        error:
          'Se alcanzó el límite diario de identificaciones gratuitas de Pl@ntNet. Probá de nuevo mañana.',
      },
      { status: 429 },
    )
  }

  if (plantnetRes.status === 404) {
    return Response.json({ error: 'No se encontraron coincidencias para esta foto.', candidates: [] })
  }

  if (!plantnetRes.ok) {
    // Diagnóstico temporal: Pl@ntNet no da detalle en el mensaje que ve el
    // usuario, así que registramos el motivo real acá (nunca la api-key) para
    // poder verlo en Vercel → Logs.
    let bodySnippet = ''
    try {
      bodySnippet = (await plantnetRes.text()).slice(0, 500)
    } catch {
      // sin body legible, seguimos igual
    }
    payload.logger.error(
      `[identify-plant] Pl@ntNet respondió ${plantnetRes.status} ${plantnetRes.statusText}: ${bodySnippet}`,
    )
    return Response.json(
      { error: 'El servicio de identificación devolvió un error. Probá con otra foto.' },
      { status: 502 },
    )
  }

  let data: PlantnetResponse
  try {
    data = await plantnetRes.json()
  } catch {
    return Response.json(
      { error: 'Respuesta inesperada del servicio de identificación.' },
      { status: 502 },
    )
  }

  const candidates = (data.results ?? []).slice(0, 5).map((result) => {
    const fullName =
      result.species.scientificNameWithoutAuthor ?? result.species.scientificName ?? ''
    const genusName =
      result.species.genus?.scientificNameWithoutAuthor ??
      result.species.genus?.scientificName ??
      fullName.split(' ')[0] ??
      ''
    const speciesEpithet = genusName
      ? fullName.slice(genusName.length).trim()
      : fullName

    return {
      scientificName: fullName,
      genus: genusName,
      species: speciesEpithet,
      family: result.species.family?.scientificNameWithoutAuthor ?? result.species.family?.scientificName ?? '',
      commonNames: result.species.commonNames ?? [],
      score: result.score,
    }
  })

  return Response.json({
    candidates,
    remainingIdentificationRequests: data.remainingIdentificationRequests,
  })
}
