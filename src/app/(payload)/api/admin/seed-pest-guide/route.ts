import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

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

type ParagraphLine = string

function toContent(lines: ParagraphLine[]) {
  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: lines.map((text) => ({
        type: 'paragraph',
        direction: null,
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

type GalleryPhotoSeed = {
  commonsFile: string
  alt: string
  credit: string
}

// 8 of 9 plagas/enfermedades have a confirmed-license photo. Caracoles y
// babosas is still pending — Wikimedia Commons was unreachable from the
// network this was written on, so that photo will be added in a follow-up
// pass. The article text below covers all 9 regardless.
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
    'El clima de Buenos Aires es, en general, bastante generoso con las orquídeas — pero sus veranos húmedos favorecen hongos y bacterias, y el aire seco de la calefacción en invierno favorece a los ácaros. Revisar las plantas una vez por semana (hojas, axilas, raíces y la base de los pseudobulbos) es el hábito que más problemas evita, porque casi todo lo de acá abajo se trata fácil si se agarra a tiempo y se complica si se deja pasar.',
    '🐛 Cochinillas algodonosas',
    'Identificación: masas blancas y algodonosas en las axilas de las hojas, en la unión de los pseudobulbos o escondidas entre las raíces. Suelen dejar una secreción pegajosa (melaza) que después se cubre de un hongo negruzco (fumagina).',
    'Tratamiento: aislá la planta de las demás apenas la detectes. Quitá las cochinillas visibles con un hisopo embebido en alcohol isopropílico al 70%, revisando bien axilas y raíces. Después, rociá con aceite de neem o jabón potásico una vez por semana durante 3–4 semanas, porque de los huevos siguen naciendo nuevas.',
    '🛡️ Cochinilla de escama',
    'Identificación: discos chatos, marrones o color hueso, pegados a hojas y tallos, que no se mueven — a diferencia de otros insectos, cuesta notar que son un bicho y no una mancha. También dejan melaza pegajosa y fumagina.',
    'Tratamiento: raspalas suavemente con la uña o un cepillo suave humedecido en alcohol, y después aplicá aceite de neem o aceite mineral cada 7–10 días hasta que no aparezcan más. Poné la planta en cuarentena mientras dure el tratamiento.',
    '🕷️ Ácaros (arañuela roja)',
    'Identificación: puntitos apenas visibles a simple vista, con una telaraña fina en el envés de las hojas y un moteado plateado o amarillento en el follaje. Es la plaga típica del invierno porteño, cuando la calefacción seca mucho el ambiente.',
    'Tratamiento: subí la humedad ambiente (los ácaros odian la humedad) y lavá el envés de las hojas con un chorro de agua cada pocos días. En casos avanzados, un acaricida específico es más efectivo que el aceite de neem. Aislá la planta afectada.',
    '🐜 Pulgones',
    'Identificación: insectos chiquitos, verdes, negros o rosados, agrupados en brotes nuevos, varas florales y botones. A veces vienen acompañados de hormigas, que los "cultivan" por la melaza que producen.',
    'Tratamiento: un chorro de agua a presión moderada saca buena parte de la colonia. Después, jabón potásico o aceite de neem cada 5–7 días. Si tenés otras plantas cerca, revisalas también — los pulgones se mueven rápido de una a otra.',
    '🦟 Trips',
    'Identificación: insectos alargados y diminutos, difíciles de ver a simple vista. Dejan estrías plateadas o rayones en hojas y, sobre todo, en los pétalos de las flores, que pueden quedar deformes o manchados.',
    'Trampas azules o amarillas pegajosas ayudan a detectarlos y bajar la población. Aceite de neem cada 7 días, aislando la planta en flor de las demás, es el tratamiento más práctico en el cultivo hogareño.',
    '⚫ Podredumbre negra / de raíz',
    'Identificación: tejido ennegrecido, blando y con olor desagradable en la base de la planta o en las raíces, que puede avanzar rápido. Suele aparecer después de un riego excesivo combinado con frío — algo frecuente en el invierno bonaerense si se sigue regando como en verano.',
    'Tratamiento: es una urgencia. Sacá la planta de la maceta, cortá todo el tejido afectado con una hoja bien desinfectada hasta llegar a tejido sano, y espolvoreá canela en polvo o un fungicida a base de cobre sobre los cortes. Repotá en sustrato nuevo y seco, y reducí el riego varias semanas.',
    '💧 Podredumbre blanda bacteriana',
    'Identificación: manchas translúcidas y "empapadas" (aspecto hidrósico) que se expanden muy rápido — a veces en cuestión de días — y suelen tener olor fuerte. Es especialmente común en Phalaenopsis durante el verano húmedo, cuando queda agua acumulada en el cogollo.',
    'Tratamiento: cortá bien adentro del tejido sano con una herramienta desinfectada, tratá el corte con un bactericida a base de cobre (o canela como alternativa casera) y mantené la planta bien seca varios días. Para prevenirla, regá de mañana y evitá que quede agua estancada en el centro de la planta.',
    '🍂 Manchas foliares fúngicas',
    'Identificación: manchas circulares o irregulares, marrones o negras, a veces con un halo amarillento alrededor, causadas por distintos hongos que se favorecen con la humedad alta y la poca circulación de aire.',
    'Tratamiento: quitá las hojas muy afectadas y, si la mancha recién empieza, cortá el sector dañado. Mejorá la ventilación alrededor de la planta y evitá mojar el follaje de noche. Si sigue avanzando, un fungicida a base de cobre corta el problema.',
    '🐌 Caracoles y babosas',
    'Identificación: mordeduras irregulares en hojas y, sobre todo, en botones florales, que suelen aparecer de la noche a la mañana. El rastro brillante de baba en el sustrato o la maceta confirma el sospechoso. Son comunes en balcones y patios del Gran Buenos Aires después de un día de lluvia.',
    'Tratamiento: la revisión nocturna con linterna y remoción manual es lo más efectivo. Como barrera, una franja de cáscara de huevo molida o tierra de diatomeas alrededor de la maceta funciona bien y no es tóxica. Evitá que la superficie del sustrato quede húmeda por las noches.',
    '🔍 Prevención general',
    'La mayoría de estos problemas se evitan con hábitos simples: poné en cuarentena 2–3 semanas a toda planta nueva antes de acercarla a tu colección, asegurá buena circulación de aire, evitá mojar hojas y cogollos de noche, y desinfectá con alcohol (o al fuego) las tijeras o cuchillas entre una planta y otra para no pasar bacterias o virus de una a otra.',
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
    }

    let postId: string | number
    if (existing) {
      await payload.update({ collection: 'blog-posts', id: existing.id, data })
      postId = existing.id
    } else {
      const created = await payload.create({ collection: 'blog-posts', data })
      postId = created.id
    }

    // Only fetch + attach gallery photos once — skip if already populated.
    const current = await payload.findByID({ collection: 'blog-posts', id: postId, depth: 0 })
    let galleryAttached = false
    if (!current.gallery || current.gallery.length === 0) {
      const galleryItems: Array<{ image: string | number; caption: string }> = []
      for (const photo of GALLERY) {
        const sourceUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(photo.commonsFile).replace(/%2F/g, '/')}?width=1600`
        const res = await fetch(sourceUrl, {
          headers: { 'User-Agent': 'ReservaOeste-PestGuideSeed/1.0 (contacto: reservaoeste.com.ar)' },
        })
        if (!res.ok) continue
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
      }
      if (galleryItems.length > 0) {
        await payload.update({
          collection: 'blog-posts',
          id: postId,
          data: { gallery: galleryItems },
        })
        galleryAttached = true
      }
    }

    return Response.json({
      ok: true,
      slug: POST.slug,
      created: !existing,
      galleryAttached,
      note: 'Falta la foto de caracoles/babosas — se agrega en un paso posterior.',
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
