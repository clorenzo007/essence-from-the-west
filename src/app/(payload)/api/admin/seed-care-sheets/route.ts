import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
 * One-time (idempotent) content seeding endpoint for the 9 orchid genus
 * care sheets, written for the Buenos Aires / Argentina climate. Gated
 * the same way /api/mobile-upload is: requires an existing Payload admin
 * session cookie, no separate secret or password involved. Safe to run
 * more than once — upserts by slug instead of duplicating.
 *
 * Visit this URL once while logged into /admin to run it:
 *   https://www.reservaoeste.com.ar/api/admin/seed-care-sheets
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

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
type Lighting = 'low' | 'medium' | 'bright' | 'very-bright'

type CareSheetSeed = {
  slug: string
  title: string
  genus: string
  alliance: string
  summary: string
  difficulty: Difficulty
  lighting: Lighting
  humidity: string
  temperature: string
  wateringNotes: string
  fertilizerNotes: string
  content: ParagraphLine[]
  featured?: boolean
}

const SHEETS: CareSheetSeed[] = [
  {
    slug: 'laelia',
    title: 'Laelias',
    genus: 'Laelia',
    alliance: 'Laelia–Cattleya',
    summary:
      'Laelias brasileñas de luz intensa y aire seco entre riegos. En Buenos Aires crecen muy bien al aire libre en primavera-verano; en invierno necesitan protección del frío nocturno.',
    difficulty: 'intermediate',
    lighting: 'very-bright',
    humidity: '50–70%',
    temperature: '20–28°C día / 12–16°C noche',
    wateringNotes:
      'En verano regá cada 4–6 días, siempre dejando secar el sustrato entre riego y riego. En invierno, con el crecimiento detenido, espaciá a cada 10–15 días y regá temprano a la mañana para que el follaje llegue seco a la noche.',
    fertilizerNotes:
      'Fertilizá cada 15 días desde septiembre hasta marzo con un fertilizante balanceado para orquídeas a mitad de dosis. En invierno (junio–agosto) suspendé o reducí a una vez por mes, ya que la planta no está en crecimiento activo.',
    content: [
      '🌸 Laelia en Buenos Aires',
      'Las Laelias brasileñas (como L. purpurata) son parientes cercanas de las Cattleyas y comparten buena parte de sus cuidados, pero piden todavía más luz. El clima porteño, con veranos cálidos y mucho sol, les sienta muy bien siempre que se las proteja de las heladas invernales.',
      '☀️ Luz',
      'Necesitan luz muy brillante, más intensa que la mayoría de las Cattleya. Al aire libre, un lugar con sol de mañana y sombra suave al mediodía funciona bien; en interior, la ventana más luminosa de la casa suele quedarse corta y conviene sumar luz artificial.',
      '💧 Riego',
      'Regá abundantemente y dejá secar bien el sustrato antes de volver a regar — las raíces gruesas no toleran la humedad constante. En los meses de calor, esto suele significar cada 4 a 6 días; en invierno, cada 10 a 15.',
      '🌱 Sustrato',
      'Corteza de pino en trozos medianos a gruesos, con excelente drenaje. Muchos cultivadores locales las montan sobre tablas de corcho o helecho, lo que imita su hábito epífito natural y facilita el secado rápido.',
      '🌡️ Temperatura',
      'Prefieren días cálidos (20–28°C) con noches más frescas (12–16°C) — justamente el patrón habitual de la primavera y el verano bonaerenses, que favorece la floración.',
      '💨 Humedad',
      'Entre 50 y 70%, con buena circulación de aire. El verano húmedo de Buenos Aires suele alcanzar esos valores sin esfuerzo; en invierno, con la calefacción de interior, conviene reforzar con un humidificador o bandeja de agua.',
      '🌬️ Ventilación',
      'Fundamental para que el follaje se seque rápido después de regar. Un ventilador suave y constante, o simplemente buena circulación de aire, previene hongos y manchas en las hojas.',
      '🌸 Floración',
      'Según la especie, florecen entre fines de primavera y verano (noviembre–febrero), con inflorescencias vistosas y perfumadas.',
      '✂️ Trasplante',
      'Cada 2 a 3 años, apenas empiece a brotar raíz nueva (fines de invierno o primavera). No hace falta apurarse: las Laelia toleran bien estar "apretadas" en la maceta.',
      '🥶 Invierno porteño',
      'Son sensibles al frío: por debajo de los 10°C empiezan a sufrir. Si las tenés al aire libre en balcón o patio, entralas a un lugar luminoso y protegido antes de que lleguen las heladas de junio a agosto.',
    ],
  },
  {
    slug: 'cattleya',
    title: 'Cattleyas',
    genus: 'Cattleya',
    alliance: 'Cattleya Alliance',
    summary:
      'La reina de las orquídeas: floración espectacular y perfumada. Se adapta bien al verano de Buenos Aires; en invierno necesita un lugar protegido del frío.',
    difficulty: 'intermediate',
    lighting: 'bright',
    humidity: '50–70%',
    temperature: '18–26°C día / 13–16°C noche',
    featured: true,
    wateringNotes:
      'En los meses cálidos (octubre–abril) regá cada 5–7 días, siempre dejando secar bien el sustrato. En invierno, con el crecimiento más lento y las temperaturas bajas de Buenos Aires, espaciá a cada 10–14 días para evitar pudrición de raíces.',
    fertilizerNotes:
      'Fertilizá cada 2 semanas en primavera-verano con un fertilizante balanceado para orquídeas (por ejemplo 20-20-20) a mitad de la dosis recomendada. Reducí a una vez por mes en otoño y suspendé casi por completo en los meses más fríos de invierno.',
    content: [
      '🌸 Cattleya en Buenos Aires',
      'Es probablemente la orquídea más popular entre coleccionistas por sus flores grandes, coloridas y muchas veces perfumadas. El clima templado-húmedo de Buenos Aires le resulta cómodo gran parte del año, con la salvedad de las noches frías de invierno.',
      '☀️ Luz',
      'Necesita luz brillante indirecta — la falta de luz es la causa número uno de que una Cattleya no florezca. Una ventana orientada al este o norte, o unas horas de sol suave de mañana al aire libre, son ideales; evitá el sol fuerte del mediodía en verano.',
      '💧 Riego',
      'Regá abundantemente y dejá que el sustrato se seque casi por completo antes de volver a regar. Es preferible quedarse corto que mantener las raíces constantemente húmedas: el exceso de riego es la forma más común de perder una Cattleya.',
      '🌱 Sustrato',
      'Corteza de pino para orquídeas, en trozos medianos, con muy buen drenaje. No uses tierra común ni sustratos que retengan agua.',
      '🌡️ Temperatura',
      'Le sientan bien los días cálidos (18–26°C) con noches algo más frescas (13–16°C); esa diferencia día/noche ayuda a la floración. Es justo el rango que ofrece Buenos Aires entre septiembre y abril.',
      '💨 Humedad',
      'Entre 50 y 70%, con buena circulación de aire para que las raíces no se encharquen. El verano porteño suele aportar esa humedad de forma natural.',
      '🌬️ Ventilación',
      'Una brisa suave y constante ayuda a mantener el follaje sano y las raíces libres de hongos, sobre todo en los meses más húmedos del año.',
      '🌸 Floración',
      'Según el híbrido, florece una o dos veces al año, típicamente en primavera-verano o en otoño, con flores que pueden durar varias semanas.',
      '✂️ Trasplante',
      'Cada 2 años aproximadamente, o cuando el sustrato se descompone y pierde drenaje. El mejor momento es apenas se ve una raíz nueva asomando, generalmente en primavera.',
      '🥶 Invierno porteño',
      'Por debajo de 12–13°C la planta se resiente. En balcones o patios de la zona oeste del Gran Buenos Aires conviene entrarla a un ambiente luminoso antes de las heladas de junio–julio, o cultivarla en un invernáculo con calefacción mínima.',
    ],
  },
  {
    slug: 'cymbidium',
    title: 'Cymbidium',
    genus: 'Cymbidium',
    alliance: 'Cymbidium Alliance',
    summary:
      'Una de las orquídeas mejor adaptadas al clima porteño: tolera el fresco del invierno y florece en esa época. Ideal para balcones y jardines semi-sombreados.',
    difficulty: 'beginner',
    lighting: 'bright',
    humidity: '40–60%',
    temperature: '15–25°C día / 5–12°C noche',
    wateringNotes:
      'Regá 2 a 3 veces por semana en primavera-verano, manteniendo el sustrato uniformemente húmedo. En invierno, aunque el Cymbidium tolera bien el fresco porteño, no dejes que se seque por completo: regá una vez por semana aproximadamente.',
    fertilizerNotes:
      'Fertilizá cada 15 días entre septiembre y marzo con un fertilizante rico en nitrógeno durante el crecimiento vegetativo, y cambiá a uno rico en fósforo (fórmula de floración) desde fines de marzo para estimular las varas florales de invierno.',
    content: [
      '🌸 Cymbidium en Buenos Aires',
      'Es, junto con el Oncidium, una de las orquídeas que mejor se adapta al clima de Buenos Aires: tolera bien el fresco del invierno local e incluso lo necesita para florecer. Muy recomendable para quien recién empieza.',
      '☀️ Luz',
      'Le gusta mucha luz, incluso algo de sol directo suave por la mañana o la tarde. Al aire libre en un balcón o patio con luz filtrada por un árbol funciona muy bien; en interior, necesita la ventana más luminosa posible.',
      '💧 Riego',
      'Mantené el sustrato apenas húmedo de forma constante, sin encharcar. A diferencia de la Cattleya, el Cymbidium no tolera secarse por completo durante mucho tiempo.',
      '🌱 Sustrato',
      'Una mezcla de corteza de pino de grano fino a mediano con algo de fibra de coco o musgo retiene humedad sin encharcar, ideal para sus raíces gruesas.',
      '🌡️ Temperatura',
      'Es una orquídea de clima fresco a templado: 15–25°C de día y hasta 5–12°C de noche. El otoño porteño (abril–mayo), con su marcado descenso de temperatura nocturna, es justo lo que necesita para iniciar la floración.',
      '💨 Humedad',
      'Se conforma con humedad moderada, 40–60%, y tolera bien el aire más seco del invierno bonaerense en comparación con otras orquídeas.',
      '🌬️ Ventilación',
      'Buena circulación de aire, sobre todo si se cultiva en el exterior, ayuda a prevenir cochinillas y hongos entre las hojas largas y apretadas.',
      '🌸 Floración',
      'Florece en invierno y principios de primavera (junio–septiembre en Buenos Aires), con varas florales largas que pueden durar más de un mes cortadas en agua.',
      '✂️ Trasplante',
      'Cada 2 a 3 años, después de la floración, a fines de invierno o inicio de primavera. Le gusta estar bastante apretado en la maceta — no lo pases a una maceta demasiado grande.',
      '☀️ Verano porteño',
      'Es de las pocas orquídeas de esta lista que puede pasar todo el verano al aire libre en Buenos Aires sin problema, incluso con algo de sol directo suave, siempre que el sustrato no se seque del todo.',
    ],
  },
  {
    slug: 'dendrobium',
    title: 'Dendrobium',
    genus: 'Dendrobium',
    alliance: 'Dendrobium Alliance',
    summary:
      'Género muy amplio; en Buenos Aires los Dendrobium tipo nobile son los que mejor funcionan, ya que aprovechan el invierno fresco para florecer.',
    difficulty: 'intermediate',
    lighting: 'bright',
    humidity: '50–70%',
    temperature: '18–28°C día / 10–15°C noche',
    wateringNotes:
      'En primavera-verano (septiembre–abril) regá cada 4–5 días. Entre mayo y agosto, reducí drásticamente a un riego liviano cada 2–3 semanas, lo justo para que la caña no se deshidrate — este descanso es indispensable para la floración.',
    fertilizerNotes:
      'Fertilizá cada 15 días de septiembre a abril con fertilizante balanceado a mitad de dosis. Suspendé por completo entre mayo y agosto: fertilizar durante el descanso invernal favorece brotes vegetativos en vez de flores.',
    content: [
      '🌸 Dendrobium en Buenos Aires',
      '"Dendrobium" agrupa miles de especies con necesidades bastante distintas entre sí. Los más habituales en viveros argentinos son del tipo nobile (cañas gruesas, flores a lo largo del tallo), que se adaptan muy bien al clima porteño porque necesitan un invierno fresco y algo seco para florecer. Si tu planta es del tipo phalaenopsis o spatulata (cañas más finas, flores en racimo colgante), es más sensible al frío y conviene tratarla más como una Vanda.',
      '☀️ Luz',
      'Luz brillante, incluyendo un poco de sol directo suave de mañana. Poca luz da plantas con cañas largas y débiles que no florecen.',
      '💧 Riego',
      'En crecimiento activo (primavera-verano), regá con generosidad apenas se seque el sustrato. Es clave entender que en otoño-invierno el riego se reduce drásticamente — es la parte que más gente se salta y por eso no logra que florezca.',
      '🌱 Sustrato',
      'Corteza de pino en trozos medianos, con buen drenaje; algunos cultivadores los montan sobre placas para que sequen aún más rápido entre riegos.',
      '🌡️ Temperatura',
      'Los tipo nobile toleran bien el fresco: 18–28°C de día y hasta 10–15°C de noche en otoño-invierno, un rango que Buenos Aires ofrece de forma natural entre abril y agosto.',
      '💨 Humedad',
      'Entre 50 y 70% en primavera-verano; en el descanso invernal, un ambiente algo más seco (40–50%) es parte de lo que estimula la floración.',
      '🌬️ Ventilación',
      'Importante todo el año para evitar manchas negras en las hojas, un problema frecuente en Dendrobium con humedad estancada.',
      '🌸 Floración',
      'Los tipo nobile florecen a fines de invierno-inicio de primavera (agosto-octubre en Buenos Aires), con flores que nacen directamente de los nudos de las cañas del año anterior.',
      '✂️ Trasplante',
      'Cada 2 años, apenas después de la floración. No lo hagas más seguido de lo necesario: les gusta estar apretados y les cuesta recuperarse de una división.',
      '🥶 El secreto porteño: descanso invernal',
      'Desde fines de mayo hasta agosto, reducí el riego a casi nada (apenas para que la caña no se arrugue) y suspendé el fertilizante. Ese "susto" de frío y sequía, tan natural en el invierno de Buenos Aires, es lo que dispara la floración en primavera. Si lo regás y fertilizás todo el año como si fuera verano, es probable que en vez de flores te crezcan solo brotes nuevos ("keikis") en los nudos.',
    ],
  },
  {
    slug: 'phalaenopsis',
    title: 'Phalaenopsis',
    genus: 'Phalaenopsis',
    alliance: 'Phalaenopsis Alliance',
    summary:
      'La orquídea de interior por excelencia. En Buenos Aires se cultiva mejor como planta de living todo el año — el invierno porteño es demasiado frío para tenerla afuera.',
    difficulty: 'beginner',
    lighting: 'medium',
    humidity: '50–70%',
    temperature: '20–28°C día / 16–20°C noche',
    wateringNotes:
      'Regá cada 7–10 días revisando el color de las raíces (plateadas = hora de regar, verdes = todavía hay humedad), siempre a la mañana. En invierno, con la calefacción encendida, el sustrato se seca más rápido — revisá con más frecuencia aunque el ritmo de riego real no cambie mucho.',
    fertilizerNotes:
      'Fertilizá cada 15 días con un fertilizante balanceado para orquídeas a un cuarto de la dosis indicada en el envase (las Phalaenopsis son sensibles al exceso de sales). Reducí a una vez por mes en los meses más fríos, cuando el crecimiento se frena.',
    content: [
      '🌸 Phalaenopsis en Buenos Aires',
      'Es la orquídea más vendida y cultivada del mundo, ideal para empezar. A diferencia del Cymbidium o el Cattleya, no está pensada para el exterior en Buenos Aires: es una planta tropical de interior todo el año en nuestro clima.',
      '☀️ Luz',
      'Luz media, indirecta, sin sol directo — una ventana con cortina liviana o un lugar luminoso sin sol de mediodía es ideal. Hojas verde oscuro parejo indican buena luz; hojas verde muy claro o amarillentas, demasiado sol.',
      '💧 Riego',
      'Regá cuando las raíces se vean plateadas/blancas en vez de verdes, generalmente cada 7 a 10 días. El error más común es regar por calendario en vez de mirar la planta: en invierno, con calefacción, puede necesitar riego más seguido que en un verano húmedo.',
      '🌱 Sustrato',
      'Corteza de pino fina a mediana, a veces mezclada con un poco de musgo sphagnum para retener algo más de humedad, en maceta transparente para poder ver el color de las raíces.',
      '🌡️ Temperatura',
      'Necesita calor constante: 20–28°C de día y no menos de 16°C de noche. Es la orquídea de esta lista más exigente en temperatura mínima — el invierno porteño (con mínimas de 5–9°C) le resulta directamente hostil si está cerca de una ventana fría o corriente de aire.',
      '💨 Humedad',
      'Entre 50 y 70%. En invierno, la calefacción de los ambientes en Buenos Aires reseca mucho el aire; conviene usar una bandeja con agua y piedras bajo la maceta o un humidificador.',
      '🌬️ Ventilación',
      'Suave pero constante, para que la corona (el centro de la planta) no acumule agua y se pudra — la causa de muerte más común en esta especie.',
      '🌸 Floración',
      'Florece habitualmente una vez al año, con varas que pueden durar 2 a 4 meses. Muchas veces la vara vuelve a brotar desde un nudo inferior después de la primera floración.',
      '✂️ Trasplante',
      'Cada 1 a 2 años, cuando el sustrato se descompone (se vuelve gris y compacto) — no hace falta esperar a que la planta se vea mal.',
      '🏠 Todo el año en interior',
      'En Buenos Aires no conviene sacarla al balcón ni siquiera en verano por las noches, ya que los cambios bruscos de temperatura la estresan. Elegí un lugar fijo, luminoso y sin corrientes de aire frío (lejos de ventanas en invierno, lejos del aire acondicionado en verano) y dejala ahí todo el año.',
    ],
  },
  {
    slug: 'miltonia',
    title: 'Miltonias',
    genus: 'Miltonia',
    alliance: 'Oncidiinae (Alianza Oncidium)',
    summary:
      "Conocidas como 'orquídea pensamiento' por el dibujo de sus flores. Necesitan riego regular sin secarse del todo y son sensibles al agua de mala calidad.",
    difficulty: 'intermediate',
    lighting: 'medium',
    humidity: '60–80%',
    temperature: '18–25°C día / 13–16°C noche',
    wateringNotes:
      'Regá 2 a 3 veces por semana, siempre manteniendo el sustrato apenas húmedo sin dejarlo secar del todo. En los días de calor extremo del verano porteño, puede necesitar riego cada 2 días; en invierno, con menos calor, alcanza con 1 vez por semana.',
    fertilizerNotes:
      'Fertilizá cada 15 días entre septiembre y marzo con un fertilizante balanceado a un cuarto de dosis, ya que son sensibles al exceso de sales. En invierno, reducí a una vez por mes.',
    content: [
      '🌸 Miltonia en Buenos Aires',
      'Llamadas "orquídeas pensamiento" por el llamativo dibujo de sus flores, las Miltonia brasileñas son algo más exigentes que sus parientes Oncidium: no toleran secarse del todo entre riegos ni el agua con mucha sal o cloro, algo a tener en cuenta con el agua de red en el AMBA.',
      '☀️ Luz',
      'Luz media, más tenue que la de un Cattleya — hojas en forma de abanico verde claro son señal de buena luz; hojas verde oscuro, de poca luz.',
      '💧 Riego',
      'A diferencia de la mayoría de las orquídeas de esta lista, no les gusta secarse por completo: mantené el sustrato apenas húmedo todo el tiempo, sin encharcar. Si el agua de la canilla es muy dura, es preferible usar agua filtrada o de lluvia.',
      '🌱 Sustrato',
      'Una mezcla fina de corteza de pino con musgo sphagnum retiene la humedad pareja que necesitan, siempre con buen drenaje para que no se encharque.',
      '🌡️ Temperatura',
      'Prefieren un rango intermedio, sin extremos: 18–25°C de día y 13–16°C de noche. Los veranos muy calurosos de Buenos Aires (por encima de 30°C) les cuestan — buscales un lugar con sombra y buena ventilación esos días.',
      '💨 Humedad',
      'Necesitan bastante, entre 60 y 80%. El verano húmedo porteño ayuda, pero en invierno con calefacción conviene reforzar con bandeja de agua o humidificador.',
      '🌬️ Ventilación',
      'Fundamental, ya que la combinación de sustrato siempre húmedo y poca circulación de aire favorece hongos en hojas y raíces.',
      '🌸 Floración',
      'Florecen generalmente en primavera-verano (octubre–enero en Buenos Aires), con flores muy vistosas que pueden durar varias semanas.',
      '✂️ Trasplante',
      'Cada 1 a 2 años — su sustrato fino se compacta más rápido que el de otras orquídeas, así que conviene no dejarlo pasar demasiado.',
      '🌡️ Cuidado con el calor porteño',
      'Son de las orquídeas de esta lista más sensibles al calor extremo del verano bonaerense, más que al frío del invierno. En los días de más de 30°C, alejalas del sol directo y reforzá la ventilación para que no sufran estrés térmico.',
    ],
  },
  {
    slug: 'oncidium',
    title: 'Oncidium',
    genus: 'Oncidium',
    alliance: 'Oncidium Alliance',
    summary:
      "La 'dama bailarina', de floración generosa y fácil adaptación al clima porteño. Una de las mejores opciones para empezar a cultivar al aire libre en Buenos Aires.",
    difficulty: 'beginner',
    lighting: 'bright',
    humidity: '50–70%',
    temperature: '18–28°C día / 12–16°C noche',
    wateringNotes:
      'En primavera-verano regá cada 4–5 días, dejando que el sustrato se seque parcialmente (no del todo) entre riegos. En invierno, espaciá a cada 8–10 días para acompañar el crecimiento más lento.',
    fertilizerNotes:
      'Fertilizá cada 15 días de septiembre a abril con fertilizante balanceado a mitad de dosis — es un género de floración generosa que agradece la alimentación regular. Reducí a una vez por mes en los meses fríos de invierno.',
    content: [
      '🌸 Oncidium en Buenos Aires',
      'Conocida como "dama bailarina" por la forma de sus flores, es uno de los géneros más agradecidos y de floración abundante. Se adapta muy bien al clima de Buenos Aires y es una excelente opción para quien recién empieza a coleccionar.',
      '☀️ Luz',
      'Luz brillante, similar a la de una Cattleya, incluyendo algo de sol suave de mañana. Poca luz da plantas verdes muy oscuras que no florecen.',
      '💧 Riego',
      'Regá bien y dejá secar el sustrato entre riegos, aunque no tan a fondo como una Cattleya — las raíces finas del Oncidium no toleran quedarse secas mucho tiempo. En verano, esto suele ser cada 4 a 5 días.',
      '🌱 Sustrato',
      'Corteza de pino de grano medio, con buen drenaje. Muchas variedades de pseudobulbos pequeños también se dan muy bien montadas sobre placas de corcho.',
      '🌡️ Temperatura',
      'Amplio rango de tolerancia: 18–28°C de día y 12–16°C de noche, lo que coincide bastante bien con el clima porteño entre septiembre y mayo.',
      '💨 Humedad',
      'Entre 50 y 70%, con buena circulación de aire. Se maneja bien con la humedad natural de Buenos Aires la mayor parte del año.',
      '🌬️ Ventilación',
      'Importante para secar rápido las raíces finas después del riego y evitar pudrición.',
      '🌸 Floración',
      'Florece generalmente en otoño (marzo–mayo en Buenos Aires) con varas ramificadas que llevan decenas de flores pequeñas y vistosas, aunque algunos híbridos florecen más de una vez al año.',
      '✂️ Trasplante',
      'Cada 1 a 2 años, cuando el pseudobulbo más nuevo empieza a formar raíces — no hace falta esperar a que el sustrato se vea mal.',
      '🥶 Invierno porteño',
      'Tolera mejor el fresco que una Cattleya, pero igual conviene protegerla de las heladas de junio-julio en el Gran Buenos Aires: un lugar luminoso contra una pared o bajo alero alcanza en la mayoría de los casos.',
    ],
  },
  {
    slug: 'brassavola',
    title: 'Brassavolas',
    genus: 'Brassavola',
    alliance: 'Cattleya Alliance (Laeliinae)',
    summary:
      'Hojas cilíndricas que resisten bien la sequía y flores nocturnas muy perfumadas. De las orquídeas más tolerantes al calor del verano porteño.',
    difficulty: 'beginner',
    lighting: 'very-bright',
    humidity: '40–60%',
    temperature: '20–30°C día / 14–18°C noche',
    wateringNotes:
      'En primavera-verano regá cada 5–7 días, dejando secar el sustrato casi del todo. En invierno, espaciá a cada 12–15 días — tolera bien pasar algo de sed, mucho mejor que el exceso de agua.',
    fertilizerNotes:
      'Fertilizá cada 3 semanas entre octubre y marzo con fertilizante balanceado a mitad de dosis. Suspendé casi por completo en invierno, cuando la planta prácticamente no crece.',
    content: [
      '🌸 Brassavola en Buenos Aires',
      'Reconocible por sus hojas cilíndricas parecidas a lápices, que almacenan agua y la hacen bastante tolerante a la sequía entre riegos. Su especie más conocida, Brassavola nodosa, perfuma intensamente de noche para atraer polinizadores — un detalle que vale la pena aprovechar teniéndola cerca de un living o galería.',
      '☀️ Luz',
      'De las que más luz necesitan de esta lista, incluyendo varias horas de sol directo suave. Un balcón o patio con sol de mañana en Buenos Aires le sienta muy bien en primavera-verano.',
      '💧 Riego',
      'Regá bien y dejá secar el sustrato casi por completo entre riegos — sus hojas gruesas toleran mejor la falta de agua que el exceso. Es una de las orquídeas más indulgentes con quien se olvida de regar de vez en cuando.',
      '🌱 Sustrato',
      'Corteza de pino en trozos medianos con muy buen drenaje, o montada directamente sobre corcho o madera, imitando su forma de crecer sobre troncos en la naturaleza.',
      '🌡️ Temperatura',
      'Le gusta el calor: 20–30°C de día y no menos de 14°C de noche. Es de las orquídeas de esta lista que mejor tolera los días más calurosos del verano bonaerense.',
      '💨 Humedad',
      'Se conforma con humedad moderada, 40–60%, más baja que la mayoría — otra ventaja para el aire más seco del invierno porteño en interior.',
      '🌬️ Ventilación',
      'Buena circulación de aire, sobre todo si se monta sobre placa, para que las raíces expuestas sequen rápido después de regar.',
      '🌸 Floración',
      'Florece generalmente en verano (diciembre–marzo en Buenos Aires), de noche, con un perfume cítrico intenso que se percibe en toda la habitación o el patio.',
      '✂️ Trasplante',
      'Cada 2 a 3 años si está en maceta; si está montada sobre placa, prácticamente no hace falta trasplantarla, solo renovar el soporte cuando se deteriora.',
      '🥶 Invierno porteño',
      'Aunque tolera bien el calor, no le gustan las heladas: por debajo de 10°C conviene resguardarla en un lugar protegido y luminoso durante junio-agosto.',
    ],
  },
  {
    slug: 'vanda',
    title: 'Vandas',
    genus: 'Vanda',
    alliance: 'Vanda Alliance (Vandeae)',
    summary:
      'La orquídea más exigente de esta lista: calor, luz y humedad constantes todo el año. En Buenos Aires solo prospera con un invernáculo climatizado — el invierno porteño es su principal enemigo.',
    difficulty: 'expert',
    lighting: 'very-bright',
    humidity: '60–80%',
    temperature: '22–32°C día / 16–20°C noche',
    wateringNotes:
      "En primavera-verano, regá o nebulizá las raíces a diario (incluso dos veces por día en los días de mucho calor), dejando que sequen en un par de horas. En invierno, si la mantenés en interior climatizado, reducí a cada 2–3 días, siempre evitando que las raíces queden mojadas por la noche.",
    fertilizerNotes:
      "Fertilizá en cada riego (fertilización diluida y constante) con un fertilizante balanceado a un cuarto de dosis durante primavera-verano. En invierno, si la planta sigue en condiciones cálidas dentro de un invernáculo, reducí a una vez por semana; si está en reposo forzado por el frío, suspendé casi por completo.",
    content: [
      '🌸 Vanda en Buenos Aires',
      'Con sus raíces gruesas y expuestas al aire y flores enormes y coloridas, la Vanda es la orquídea más espectacular — y también la más exigente — de esta lista. Es de origen tropical y necesita calor y humedad constantes durante todo el año, algo que el clima de Buenos Aires no ofrece de forma natural en invierno.',
      '☀️ Luz',
      'Necesita muchísima luz, incluyendo varias horas de sol directo. Se cultiva típicamente colgada, en canasto o cesto sin sustrato, con las raíces al aire libre.',
      '💧 Riego',
      'Como no tiene sustrato que retenga agua, se riega (o se moja por completo, incluidas las raíces) todos los días en los meses cálidos, y las raíces deben secarse en un par de horas. Es un riego muy distinto al de cualquier otra orquídea de esta lista.',
      '🌱 Sustrato',
      'Ninguno: se cultiva bare-root (raíz desnuda) en canastos de madera o colgada directamente, dejando que las raíces cuelguen al aire libre.',
      '🌡️ Temperatura',
      'Necesita calor constante: 22–32°C de día y no menos de 16°C de noche, en cualquier época del año. El invierno porteño, con mínimas de 5–9°C, está muy por debajo de lo que tolera sin protección.',
      '💨 Humedad',
      'Alta y constante, 60–80%, con riegos o nebulizaciones frecuentes para compensar que las raíces están expuestas al aire seco.',
      '🌬️ Ventilación',
      'Constante pero suave, ya que la combinación de raíces siempre húmedas y aire estancado es fatal para esta especie.',
      '🌸 Floración',
      'Puede florecer más de una vez al año si las condiciones son buenas, con flores grandes que duran varias semanas.',
      '✂️ Trasplante',
      'No aplica en el sentido tradicional: al no tener sustrato, solo hay que renovar o agrandar el canasto cuando la planta lo supera.',
      '🥶 El gran desafío porteño: el invierno',
      'Esta es, sin dudas, la orquídea menos apta para el clima de Buenos Aires sin ayuda: necesita un invernáculo con calefacción y humedad controlada entre mayo y septiembre para sobrevivir el invierno. Si no contás con ese tipo de instalación, es preferible reservarla para cultivadores con más experiencia e infraestructura, o mantenerla en un ambiente interior muy luminoso y húmedo (baño con buena luz, por ejemplo) durante los meses fríos.',
    ],
  },
]

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json(
      { error: 'No autenticado. Iniciá sesión en /admin y volvé a abrir este link.' },
      { status: 401 },
    )
  }

  const created: string[] = []
  const updated: string[] = []
  const errors: Array<{ slug: string; error: string }> = []

  for (const sheet of SHEETS) {
    try {
      const existing = await payload.find({
        collection: 'care-sheets',
        where: { slug: { equals: sheet.slug } },
        limit: 1,
        depth: 0,
      })

      const data = {
        title: sheet.title,
        genus: sheet.genus,
        alliance: sheet.alliance,
        summary: sheet.summary,
        content: toContent(sheet.content),
        difficulty: sheet.difficulty,
        lighting: sheet.lighting,
        humidity: sheet.humidity,
        temperature: sheet.temperature,
        wateringNotes: sheet.wateringNotes,
        fertilizerNotes: sheet.fertilizerNotes,
        status: 'published' as const,
        featured: sheet.featured ?? false,
        slug: sheet.slug,
      }

      if (existing.docs[0]) {
        await payload.update({
          collection: 'care-sheets',
          id: existing.docs[0].id,
          data,
        })
        updated.push(sheet.slug)
      } else {
        await payload.create({
          collection: 'care-sheets',
          data,
        })
        created.push(sheet.slug)
      }
    } catch (err) {
      errors.push({
        slug: sheet.slug,
        error: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  return Response.json({ created, updated, errors })
}
