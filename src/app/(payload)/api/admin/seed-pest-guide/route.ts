import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One-time (idempotent) endpoint that publishes the "Plagas y enfermedades"
 * journal article (identification + treatment for the most common orchid
 * pests/diseases in the Buenos Aires climate) and attaches a photo gallery
 * sourced from Wikimedia Commons (CC-BY / CC-BY-SA / CC0 only).
 *
 * Idempotent: re-running updates the text content but only fetches/attaches
 * the gallery photos once (skipped if the post already has a gallery), so
 * it's safe to re-run after editing the article text.
 *
 * Visit once while logged into /admin:
 *   https://www.reservaoeste.com.ar/api/admin/seed-pest-guide
 */

type ContentBlock = { type: 'heading'; text: string } | { type: 'paragraph'; text: string }

function h(text: string): ContentBlock {
  return { type: 'heading', text }
}

function p(text: string): ContentBlock {
  return { type: 'paragraph', text }
}

function toContent(blocks: ContentBlock[]) {
  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: blocks.map((block) => {
        const textNode = {
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: block.text,
          version: 1,
        }

        if (block.type === 'heading') {
          return {
            type: 'heading',
            tag: 'h3',
            direction: null,
            format: '',
            indent: 0,
            version: 1,
            children: [textNode],
          }
        }

        return {
          type: 'paragraph',
          direction: null,
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
          children: [textNode],
        }
      }),
    },
  }
}

type GalleryPhotoSeed = {
  commonsFile: string
  alt: string
  credit: string
}

// All 9 plagas/enfermedades have a confirmed-license photo.
const GALLERY: GalleryPhotoSeed[] = [
  {
    commonsFile: 'Cocciniglia_-_Mealybug_-_Gianni_Del_Bufalo_bygdb.jpg',
    alt: 'Cochinillas algodonosas (Pseudococcidae) sobre una orquídea',
    credit: 'Cochinillas algodonosas — Foto: gianni del bufalo — CC BY 2.0, Wikimedia Commons',
  },
  {
    commonsFile: 'Coccus_hesperidum_01.JPG',
    alt: 'Cochinilla de escama (Coccus hesperidum) sobre una hoja',
    credit: 'Cochinilla de escama — Foto: AfroBrazilian — CC BY-SA 3.0, Wikimedia Commons',
  },
  {
    commonsFile: 'Tetranychus_urticae_with_silk_threads.jpg',
    alt: 'Ácaro / arañuela roja (Tetranychus urticae) con hilos de seda',
    credit: 'Ácaros (arañuela roja) — Foto: Gilles San Martin — CC BY-SA 2.0, Wikimedia Commons',
  },
  {
    commonsFile: 'Aphidoidea_puceron_Luc_Viatour.jpg',
    alt: 'Colonia de pulgones sobre un tallo',
    credit: 'Pulgones — Foto: Luc Viatour (lucnix.be) — CC BY-SA 3.0, Wikimedia Commons',
  },
  {
    commonsFile: 'Frankliniella_sp._-_Guelph,_Ontario_2017-06-21_(02).jpg',
    alt: 'Trips (Frankliniella sp.) en detalle macro',
    credit: 'Trips — Foto: Ryan Hodnett — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    commonsFile: 'Rhododendron-Phytophthora_Root_Rot_(2).jpg',
    alt: 'Raíces con podredumbre negra causada por Phytophthora',
    credit: 'Podredumbre negra / de raíz (Phytophthora) — Foto: Jerzy Opioła — CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    commonsFile:
      'Bacterial_blight_of_orchid_leaf_at_a_nursery_on_the_island_of_Hawaii_(8251192670).jpg',
    alt: 'Hoja de orquídea con podredumbre blanda bacteriana',
    credit: 'Podredumbre blanda bacteriana (Erwinia) — Foto: Scot Nelson — Dominio público (CC0), Wikimedia Commons',
  },
  {
    commonsFile: 'Spinach-_Cercospora_leaf_spot_-_7.jpg',
    alt: 'Manchas foliares fúngicas de tipo Cercospora',
    credit: 'Manchas foliares fúngicas — Foto: Scot Nelson — Dominio público (CC0), Wikimedia Commons',
  },
  {
    commonsFile: 'Baby_Garden_Snail_(Cornu_aspersum).jpg',
    alt: 'Caracol (Cornu aspersum) sobre una hoja',
    credit: 'Caracoles y babosas — Foto: Matthew T Rader (matthewtrader.com) — CC BY-SA 4.0, Wikimedia Commons',
  },
]

const POST = {
  slug: 'plagas-y-enfermedades-de-las-orquideas',
  title: 'Plagas y enfermedades de las orquídeas: identificación y tratamiento',
  excerpt:
    'Guía práctica para reconocer a tiempo las plagas y enfermedades más comunes en orquídeas cultivadas en Buenos Aires, y cómo tratarlas sin perder la planta.',
  tags: [
    'Cochinillas',
    'Cochinilla de escama',
    'Ácaros',
    'Pulgones',
    'Trips',
    'Podredumbre negra',
    'Podredumbre blanda bacteriana',
    'Manchas foliares',
    'Caracoles y babosas',
  ],
  content: [
    p(
      'El clima de Buenos Aires es, en general, bastante generoso con las orquídeas — pero sus veranos húmedos favorecen hongos y bacterias, y el aire seco de la calefacción en invierno favorece a los ácaros. El hábito que más problemas evita es revisar las plantas una vez por semana: hojas, axilas, raíces y la base de los pseudobulbos. Casi todo lo que sigue se trata fácil si se agarra a tiempo, y se complica bastante si se deja pasar.',
    ),
    h('Cochinillas algodonosas'),
    p(
      'Se las reconoce por esas masas blancas y algodonosas que aparecen en las axilas de las hojas, en la unión de los pseudobulbos o escondidas entre las raíces, y que suelen dejar una secreción pegajosa (melaza) que después se cubre de un hongo negruzco (fumagina). Apenas las detectes, aislá la planta de las demás. Quitá las que veas con un hisopo embebido en alcohol isopropílico al 70%, revisando bien axilas y raíces, y después rociá con aceite de neem o jabón potásico una vez por semana durante 3 a 4 semanas — de los huevos que quedan siguen naciendo cochinillas nuevas, así que un solo tratamiento no alcanza.',
    ),
    h('Cochinilla de escama'),
    p(
      'Son discos chatos, marrones o color hueso, pegados a hojas y tallos, que no se mueven — a diferencia de otros insectos, cuesta notar a simple vista que se trata de un bicho y no de una mancha. También dejan melaza pegajosa y fumagina. Se sacan raspando suavemente con la uña o un cepillo suave humedecido en alcohol, y después conviene aplicar aceite de neem o aceite mineral cada 7 a 10 días hasta que dejen de aparecer, con la planta en cuarentena mientras dure el tratamiento.',
    ),
    h('Ácaros o arañuela roja'),
    p(
      'Son puntitos apenas visibles a simple vista, con una telaraña fina en el envés de las hojas y un moteado plateado o amarillento en el follaje. Es la plaga típica del invierno porteño, cuando la calefacción reseca mucho el ambiente. Subir la humedad ayuda bastante, porque los ácaros la odian; lavar el envés de las hojas con un chorro de agua cada pocos días también controla la población, y en casos ya avanzados un acaricida específico funciona mejor que el aceite de neem. Conviene aislar la planta afectada mientras se trata.',
    ),
    h('Pulgones'),
    p(
      'Son insectos chiquitos, verdes, negros o rosados, agrupados en brotes nuevos, varas florales y botones — a veces acompañados de hormigas, que los "cultivan" por la melaza que producen. Un chorro de agua a presión moderada saca buena parte de la colonia; después conviene seguir con jabón potásico o aceite de neem cada 5 a 7 días. Si hay otras plantas cerca vale la pena revisarlas también, porque los pulgones se mueven rápido de una a otra.',
    ),
    h('Trips'),
    p(
      'Son insectos alargados y diminutos, difíciles de ver a simple vista, que dejan estrías plateadas o rayones en las hojas y, sobre todo, en los pétalos de las flores, que pueden quedar deformes o manchados. Las trampas azules o amarillas pegajosas ayudan a detectarlos y bajar la población, y el aceite de neem aplicado cada 7 días — aislando la planta en flor de las demás — es el tratamiento más práctico en el cultivo hogareño.',
    ),
    h('Podredumbre negra o de raíz'),
    p(
      'Se manifiesta como tejido ennegrecido, blando y con olor desagradable en la base de la planta o en las raíces, que puede avanzar rápido. Suele aparecer después de un riego excesivo combinado con frío, algo frecuente en el invierno bonaerense si se sigue regando como en verano. Es una urgencia: hay que sacar la planta de la maceta, cortar todo el tejido afectado con una hoja bien desinfectada hasta llegar a tejido sano, y espolvorear canela en polvo o un fungicida a base de cobre sobre los cortes. Después, repotar en sustrato nuevo y seco, y reducir el riego durante varias semanas.',
    ),
    h('Podredumbre blanda bacteriana'),
    p(
      'Aparece como manchas translúcidas y "empapadas" que se expanden muy rápido — a veces en cuestión de días — y suelen tener un olor fuerte. Es especialmente común en Phalaenopsis durante el verano húmedo, cuando queda agua acumulada en el cogollo. Conviene cortar bien adentro del tejido sano con una herramienta desinfectada, tratar el corte con un bactericida a base de cobre (o canela como alternativa casera) y mantener la planta bien seca varios días. Para prevenirla, lo mejor es regar de mañana y evitar que quede agua estancada en el centro de la planta.',
    ),
    h('Manchas foliares fúngicas'),
    p(
      'Son manchas circulares o irregulares, marrones o negras, a veces con un halo amarillento alrededor, causadas por distintos hongos que se ven favorecidos por la humedad alta y la poca circulación de aire. Conviene quitar las hojas muy afectadas y, si la mancha recién empieza, cortar el sector dañado. Mejorar la ventilación alrededor de la planta y evitar mojar el follaje de noche frena bastante el problema; si sigue avanzando, un fungicida a base de cobre lo corta.',
    ),
    h('Caracoles y babosas'),
    p(
      'Dejan mordeduras irregulares en hojas y, sobre todo, en botones florales, que suelen aparecer de la noche a la mañana — el rastro brillante de baba en el sustrato o la maceta confirma al sospechoso. Son comunes en balcones y patios del Gran Buenos Aires después de un día de lluvia. La revisión nocturna con linterna y remoción manual es lo más efectivo; como barrera, una franja de cáscara de huevo molida o tierra de diatomeas alrededor de la maceta funciona bien y no es tóxica. También ayuda evitar que la superficie del sustrato quede húmeda por las noches.',
    ),
    h('Prevención general'),
    p(
      'La mayoría de estos problemas se evitan con hábitos simples: poné en cuarentena 2 a 3 semanas a toda planta nueva antes de acercarla a tu colección, asegurá buena circulación de aire, evitá mojar hojas y cogollos de noche, y desinfectá con alcohol (o al fuego) las tijeras o cuchillas entre una planta y otra, para no pasar bacterias o virus de una a la siguiente.',
    ),
  ],
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

  try {
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: POST.slug } },
      limit: 1,
      depth: 0,
    })
    const existing = docs[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      title: POST.title,
      excerpt: POST.excerpt,
      content: toContent(POST.content),
      tags: POST.tags.map((label) => ({ label })),
      status: 'published' as const,
      slug: POST.slug,
      meta: {
        title: 'Plagas y enfermedades de las orquídeas: guía',
        description: POST.excerpt.slice(0, 160),
      },
    }

    let postId: string | number
    if (existing) {
      await payload.update({ collection: 'blog-posts', id: existing.id, data })
      postId = existing.id
    } else {
      const created = await payload.create({ collection: 'blog-posts', data })
      postId = created.id
    }

    // Fetch + attach only the gallery photos that aren't there yet (matched by
    // caption/credit text), so a re-run after a partial failure (Wikimedia
    // thumbnail generation can be slow/flaky) fills in just what's missing
    // instead of being skipped entirely.
    const current = await payload.findByID({ collection: 'blog-posts', id: postId, depth: 0 })
    const existingCaptions = new Set(
      (current.gallery ?? []).map((item) => item.caption).filter(Boolean),
    )
    const missingPhotos = GALLERY.filter((photo) => !existingCaptions.has(photo.credit))

    const galleryItems: Array<{ image: string | number; caption: string }> = []
    const photoErrors: Array<{ file: string; error: string }> = []

    async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
      let lastErr: unknown
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(url, {
            headers: { 'User-Agent': 'ReservaOeste-PestGuideSeed/1.0 (contacto: reservaoeste.com.ar)' },
          })
          if (res.ok) return res
          lastErr = new Error(`HTTP ${res.status}`)
        } catch (err) {
          lastErr = err
        }
        // brief backoff before retrying — Wikimedia's thumbnail scaler can be
        // slow to generate a size it hasn't cached yet.
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
      throw lastErr instanceof Error ? lastErr : new Error('No se pudo descargar la imagen.')
    }

    for (const photo of missingPhotos) {
      try {
        const sourceUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(photo.commonsFile).replace(/%2F/g, '/')}?width=1600`
        const res = await fetchWithRetry(sourceUrl)
        const buffer = Buffer.from(await res.arrayBuffer())
        const contentType = res.headers.get('content-type') || 'image/jpeg'
        const mediaDoc = await payload.create({
          collection: 'media',
          data: { alt: photo.alt, caption: photo.credit },
          file: {
            data: buffer,
            mimetype: contentType,
            name: `pest-${photo.commonsFile.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()}`,
            size: buffer.length,
          },
        })
        galleryItems.push({ image: mediaDoc.id, caption: photo.credit })
      } catch (err) {
        photoErrors.push({
          file: photo.commonsFile,
          error: err instanceof Error ? err.message : 'Error desconocido',
        })
      }
    }

    let galleryAttached = false
    if (galleryItems.length > 0) {
      const combined = [
        ...(current.gallery ?? []).map((item) => ({ image: item.image, caption: item.caption ?? '' })),
        ...galleryItems,
      ]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const galleryData: any = { gallery: combined }
      await payload.update({
        collection: 'blog-posts',
        id: postId,
        data: galleryData,
      })
      galleryAttached = true
    }

    return Response.json({
      ok: true,
      slug: POST.slug,
      created: !existing,
      galleryAttached,
      photosAddedThisRun: galleryItems.length,
      photosAlreadyPresent: existingCaptions.size,
      photoErrors,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
