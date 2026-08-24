import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
 * One-time (idempotent) endpoint that attaches a heroImage photo to each of
 * the 9 genus care sheets. Images come from Wikimedia Commons, filtered to
 * CC-BY / CC-BY-SA / public-domain licensed files only (this is a commercial
 * site, so attribution-compatible licensing matters). Each Media doc's
 * caption carries the required attribution text.
 *
 * Idempotent: skips any care sheet that already has a heroImage set, so it's
 * safe to re-run (e.g. after adding a 10th genus) without clobbering a photo
 * someone picked manually in the admin later.
 *
 * Visit once while logged into /admin:
 *   https://www.reservaoeste.com.ar/api/admin/seed-care-sheet-photos
 */

type PhotoSeed = {
  slug: string
  // Wikimedia Commons file title, without the "File:" prefix, exactly as it
  // appears in the page URL (spaces as underscores or %20 both work with
  // Special:FilePath).
  commonsFile: string
  alt: string
  credit: string
}

const PHOTOS: PhotoSeed[] = [
  {
    slug: 'laelia',
    commonsFile:
      'Starr-120522-6528-Laelia_purpurata-Schuster_flowering_habit-Iao_Tropical_Gardens_of_Maui-Maui_(24848209430).jpg',
    alt: 'Laelia purpurata en flor',
    credit: 'Foto: Forest & Kim Starr — CC BY 3.0 US, Wikimedia Commons',
  },
  {
    slug: 'cattleya',
    commonsFile: 'Cattleya_orchids.jpg',
    alt: 'Cattleya en flor',
    credit: 'Foto: পাপৰি বৰা — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    slug: 'cymbidium',
    commonsFile: "Low's_boat_orchid_(Cymbidium_lowianum)_flower.jpg",
    alt: 'Cymbidium lowianum en flor',
    credit: 'Foto: Pseudopanax — Dominio público, Wikimedia Commons',
  },
  {
    slug: 'dendrobium',
    commonsFile: 'Purple_dendrobium_-NationalOrchidGarden-Singapore-20080224.jpg',
    alt: 'Dendrobium en flor',
    credit: 'Foto: Shiny Things — CC BY 2.0, Wikimedia Commons',
  },
  {
    slug: 'phalaenopsis',
    commonsFile: 'Phalaenopsis_July_2020-2.jpg',
    alt: 'Phalaenopsis amabilis en flor',
    credit: 'Foto: Joaquim Alves Gaspar — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    slug: 'miltonia',
    commonsFile: 'Nature_La_Réunion,_janvier_2018_64.jpg',
    alt: 'Miltonia en flor',
    credit: 'Foto: Auregann — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    slug: 'oncidium',
    commonsFile: 'Kandian_dancers_orchid.jpg',
    alt: 'Oncidium (Kandyan Dancer) en flor',
    credit: 'Foto: Imidumi — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    slug: 'brassavola',
    commonsFile: 'Brassavola_nodosa1.jpg',
    alt: 'Brassavola nodosa en flor',
    credit: 'Foto: KENPEI — CC BY 3.0, Wikimedia Commons',
  },
  {
    slug: 'vanda',
    commonsFile: 'Vanda_coerulea,_commonly_known_as_blue_orchid_2.jpg',
    alt: 'Vanda coerulea en flor',
    credit: 'Foto: পাপৰি বৰা — CC BY-SA 4.0, Wikimedia Commons',
  },
]

function commonsFilePathUrl(commonsFile: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFile).replace(/%2F/g, '/')}?width=1600`
}

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json(
      { error: 'No autenticado. Iniciá sesión en /admin y volvé a abrir este link.' },
      { status: 401 },
    )
  }

  const attached: string[] = []
  const skipped: string[] = []
  const errors: Array<{ slug: string; error: string }> = []

  for (const photo of PHOTOS) {
    try {
      const { docs } = await payload.find({
        collection: 'care-sheets',
        where: { slug: { equals: photo.slug } },
        limit: 1,
        depth: 0,
      })

      const sheet = docs[0]
      if (!sheet) {
        errors.push({ slug: photo.slug, error: 'No existe la ficha (corré primero seed-care-sheets).' })
        continue
      }

      if (sheet.heroImage) {
        skipped.push(photo.slug)
        continue
      }

      const sourceUrl = commonsFilePathUrl(photo.commonsFile)
      const res = await fetch(sourceUrl, {
        headers: { 'User-Agent': 'ReservaOeste-CareSheetSeed/1.0 (contacto: reservaoeste.com.ar)' },
      })
      if (!res.ok) {
        throw new Error(`No se pudo descargar la foto de Wikimedia (HTTP ${res.status}).`)
      }
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const contentType = res.headers.get('content-type') || 'image/jpeg'

      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: photo.alt,
          caption: photo.credit,
        },
        file: {
          data: buffer,
          mimetype: contentType,
          name: `care-sheet-${photo.slug}.jpg`,
          size: buffer.length,
        },
      })

      await payload.update({
        collection: 'care-sheets',
        id: sheet.id,
        data: { heroImage: mediaDoc.id },
      })

      attached.push(photo.slug)
    } catch (err) {
      errors.push({
        slug: photo.slug,
        error: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  return Response.json({ attached, skipped, errors })
}
