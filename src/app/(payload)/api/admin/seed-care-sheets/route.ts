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
  content: ContentBlock[]
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
      p(
        'Las Laelias brasileñas, como L. purpurata, son primas cercanas de las Cattleya y comparten buena parte de sus cuidados — aunque piden todavía más luz. El clima porteño, con veranos cálidos y mucho sol, les sienta bien siempre que se las proteja de las heladas de invierno.',
      ),
      h('Luz'),
      p(
        'Necesitan luz muy intensa, más que la mayoría de las Cattleya. Al aire libre, un lugar con sol de mañana y sombra suave al mediodía suele funcionar bien; en interior, hasta la ventana más luminosa de la casa se queda corta y conviene sumar luz artificial.',
      ),
      h('Riego y sustrato'),
      p(
        'Regá abundantemente y dejá secar bien el sustrato antes de volver a regar: las raíces gruesas no toleran la humedad constante. En los meses de calor esto suele significar cada 4 a 6 días, y en invierno cada 10 a 15. La corteza de pino en trozos medianos a gruesos, con muy buen drenaje, es la base habitual; muchos cultivadores locales directamente las montan sobre tablas de corcho o helecho, que imitan su hábito epífito natural y aceleran el secado.',
      ),
      h('Temperatura y humedad'),
      p(
        'Prefieren días cálidos (20–28°C) con noches más frescas (12–16°C), justo el patrón habitual de la primavera y el verano bonaerenses, que además favorece la floración. La humedad ideal ronda el 50–70%, algo que el verano húmedo de Buenos Aires suele aportar sin esfuerzo; en invierno, con la calefacción de interior, conviene reforzar con un humidificador o una bandeja de agua. Vale la pena sumar algo de circulación de aire — un ventilador suave y constante alcanza — para que el follaje se seque rápido después de regar y no aparezcan hongos.',
      ),
      h('Floración'),
      p(
        'Según la especie, florecen entre fines de primavera y verano (noviembre a febrero), con inflorescencias vistosas y perfumadas.',
      ),
      h('Trasplante'),
      p(
        'Cada 2 a 3 años, apenas empiece a asomar raíz nueva, generalmente a fines de invierno o en primavera. No hay apuro: las Laelia toleran bastante bien estar apretadas en la maceta.',
      ),
      h('Invierno porteño'),
      p(
        'Son sensibles al frío — por debajo de los 10°C ya empiezan a sufrir. Si las tenés en un balcón o patio, conviene entrarlas a un lugar luminoso y protegido antes de que lleguen las heladas de junio a agosto.',
      ),
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
      p(
        'Es probablemente la orquídea más popular entre coleccionistas, por sus flores grandes, coloridas y muchas veces perfumadas. El clima templado-húmedo de Buenos Aires le resulta cómodo casi todo el año, con la excepción de las noches frías de invierno.',
      ),
      h('Luz'),
      p(
        'Necesita luz brillante indirecta — de hecho, la falta de luz es la causa número uno de que una Cattleya no florezca. Una ventana orientada al este o al norte, o unas horas de sol suave de mañana al aire libre, funcionan bien; conviene evitar el sol fuerte del mediodía en verano.',
      ),
      h('Riego y sustrato'),
      p(
        'Regá abundantemente y dejá que el sustrato se seque casi por completo antes de volver a regar. Ante la duda, mejor quedarse corto que mantener las raíces todo el tiempo húmedas: el exceso de agua es, con diferencia, la forma más común de perder una Cattleya. Usá corteza de pino para orquídeas en trozos medianos, con muy buen drenaje — nada de tierra común ni sustratos que retengan agua.',
      ),
      h('Temperatura y humedad'),
      p(
        'Le sientan bien los días cálidos (18–26°C) con noches algo más frescas (13–16°C); esa diferencia entre el día y la noche ayuda a la floración, y es justo el rango que ofrece Buenos Aires entre septiembre y abril. La humedad ideal está entre 50 y 70%, con buena circulación de aire para que las raíces no se encharquen — el verano porteño suele aportar esa humedad de forma natural, y una brisa suave y constante mantiene el follaje sano.',
      ),
      h('Floración'),
      p(
        'Según el híbrido, florece una o dos veces al año, típicamente en primavera-verano o en otoño, con flores que pueden durar varias semanas.',
      ),
      h('Trasplante'),
      p(
        'Cada 2 años aproximadamente, o cuando el sustrato se descompone y pierde drenaje. El mejor momento es apenas se ve asomar una raíz nueva, generalmente en primavera.',
      ),
      h('Invierno porteño'),
      p(
        'Por debajo de los 12–13°C la planta se resiente. En balcones o patios de la zona oeste del Gran Buenos Aires conviene entrarla a un ambiente luminoso antes de las heladas de junio y julio, o cultivarla en un invernáculo con calefacción mínima.',
      ),
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
      p(
        'Es, junto con el Oncidium, una de las orquídeas que mejor se adapta al clima de Buenos Aires: tolera bien el fresco del invierno local, y de hecho lo necesita para florecer. Muy recomendable para quien recién empieza.',
      ),
      h('Luz'),
      p(
        'Le gusta mucha luz, incluso algo de sol directo suave por la mañana o la tarde. Un balcón o patio con luz filtrada por un árbol funciona muy bien al aire libre; en interior, va a necesitar la ventana más luminosa que tengas.',
      ),
      h('Riego y sustrato'),
      p(
        'Mantené el sustrato apenas húmedo de forma constante, sin encharcar — a diferencia de la Cattleya, el Cymbidium no tolera secarse del todo por mucho tiempo. En la práctica, esto es regar 2 a 3 veces por semana en primavera-verano y una vez por semana en invierno, aunque tolere bien el fresco porteño. Una mezcla de corteza de pino de grano fino a mediano con algo de fibra de coco o musgo retiene humedad sin encharcar, algo que sus raíces gruesas agradecen.',
      ),
      h('Temperatura y humedad'),
      p(
        'Es una orquídea de clima fresco a templado: 15–25°C de día y hasta 5–12°C de noche. El otoño porteño (abril-mayo), con su marcado descenso de temperatura nocturna, es justo lo que necesita para iniciar la floración. Se conforma con humedad moderada (40–60%) y tolera el aire seco del invierno bonaerense mejor que la mayoría de las orquídeas de esta lista; si se cultiva afuera, conviene cuidar la circulación de aire para prevenir cochinillas entre las hojas largas y apretadas.',
      ),
      h('Floración'),
      p(
        'Florece en invierno y principios de primavera (junio a septiembre en Buenos Aires), con varas florales largas que pueden durar más de un mes una vez cortadas y puestas en agua.',
      ),
      h('Trasplante'),
      p(
        'Cada 2 a 3 años, después de la floración, a fines de invierno o inicio de primavera. Le gusta estar bastante apretado en la maceta, así que no conviene pasarlo a una demasiado grande.',
      ),
      h('Verano porteño'),
      p(
        'Es una de las pocas orquídeas de esta lista que puede pasar todo el verano al aire libre en Buenos Aires sin problema, incluso con algo de sol directo suave, siempre que el sustrato no llegue a secarse del todo.',
      ),
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
      p(
        '"Dendrobium" agrupa miles de especies con necesidades bastante distintas entre sí. Los más habituales en viveros argentinos son del tipo nobile — cañas gruesas, flores a lo largo del tallo —, que se adaptan muy bien al clima porteño porque necesitan un invierno fresco y algo seco para florecer. Si tu planta es del tipo phalaenopsis o spatulata (cañas más finas, flores en racimo colgante), es más sensible al frío y conviene tratarla más como una Vanda.',
      ),
      h('Luz'),
      p(
        'Necesita luz brillante, incluyendo algo de sol directo suave de mañana. Con poca luz crecen cañas largas y débiles que no florecen.',
      ),
      h('Riego y sustrato'),
      p(
        'En crecimiento activo (primavera-verano) regá con generosidad apenas se seque el sustrato, cada 4 a 5 días aproximadamente. Lo importante — y lo que más gente se salta — es que en otoño-invierno el riego tiene que bajar drásticamente, a un riego liviano cada 2 a 3 semanas, apenas lo justo para que la caña no se deshidrate: ese descanso es indispensable para que florezca. Usá corteza de pino en trozos medianos con buen drenaje; algunos cultivadores directamente los montan sobre placas para que sequen aún más rápido.',
      ),
      h('Temperatura y humedad'),
      p(
        'Los tipo nobile toleran bien el fresco: 18–28°C de día y hasta 10–15°C de noche en otoño-invierno, un rango que Buenos Aires ofrece de forma natural entre abril y agosto. La humedad ronda el 50–70% en primavera-verano, pero en el descanso invernal un ambiente algo más seco (40–50%) forma parte de lo que estimula la floración. La ventilación importa todo el año, para evitar las manchas negras que aparecen fácil en este género cuando la humedad se estanca.',
      ),
      h('Floración'),
      p(
        'Los tipo nobile florecen a fines de invierno e inicio de primavera (agosto-octubre en Buenos Aires), con flores que nacen directamente de los nudos de las cañas del año anterior.',
      ),
      h('Trasplante'),
      p(
        'Cada 2 años, apenas después de la floración. No conviene hacerlo más seguido de lo necesario: les gusta estar apretados y les cuesta recuperarse de una división.',
      ),
      h('El secreto porteño: el descanso invernal'),
      p(
        'Desde fines de mayo hasta agosto, bajá el riego a casi nada — apenas para que la caña no se arrugue — y suspendé el fertilizante. Ese "susto" de frío y sequía, tan natural en el invierno de Buenos Aires, es lo que dispara la floración en primavera. Regarlo y fertilizarlo todo el año como si fuera verano suele terminar en brotes nuevos (keikis) en los nudos, en vez de flores.',
      ),
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
      p(
        'Es la orquídea más vendida y cultivada del mundo, y una excelente opción para empezar. A diferencia del Cymbidium o la Cattleya, no está pensada para el exterior en Buenos Aires: en nuestro clima es una planta de interior los doce meses del año.',
      ),
      h('Luz'),
      p(
        'Necesita luz media, indirecta, sin sol directo — una ventana con cortina liviana o un rincón luminoso sin sol de mediodía es ideal. Hojas de un verde oscuro parejo indican buena luz; si se ven verde muy claro o amarillentas, hay demasiado sol.',
      ),
      h('Riego y sustrato'),
      p(
        'Regá cuando las raíces se vean plateadas o blancas en vez de verdes — normalmente cada 7 a 10 días — y hacelo a la mañana. El error más común es regar por calendario en vez de mirar la planta: en invierno, con la calefacción prendida, el sustrato se seca más rápido y puede pedir agua con más frecuencia que en un verano húmedo. Usá corteza de pino fina a mediana, a veces con un poco de musgo sphagnum, y una maceta transparente que te deje ver el color de las raíces.',
      ),
      h('Temperatura y humedad'),
      p(
        'Necesita calor constante: 20–28°C de día y no menos de 16°C de noche. Es la más exigente de esta lista en cuanto a temperatura mínima — el invierno porteño, con mínimas de 5–9°C, le resulta directamente hostil si está cerca de una ventana fría o de una corriente de aire. La humedad ideal es 50–70%; como la calefacción de los ambientes en Buenos Aires reseca mucho el aire en invierno, conviene una bandeja con agua y piedras bajo la maceta o un humidificador. La ventilación tiene que ser suave pero constante, para que la corona (el centro de la planta) no acumule agua y se pudra, que es la causa de muerte más común en esta especie.',
      ),
      h('Floración'),
      p(
        'Florece habitualmente una vez al año, con varas que pueden durar de 2 a 4 meses. Muchas veces, después de la primera floración, la misma vara vuelve a brotar desde un nudo inferior.',
      ),
      h('Trasplante'),
      p(
        'Cada 1 a 2 años, cuando el sustrato se descompone y se pone gris y compacto — no hace falta esperar a que la planta se vea mal para cambiarlo.',
      ),
      h('Todo el año en interior'),
      p(
        'En Buenos Aires no conviene sacarla al balcón ni siquiera en las noches de verano, porque los cambios bruscos de temperatura la estresan. Mejor elegirle un lugar fijo, luminoso y sin corrientes de aire frío — lejos de la ventana en invierno, lejos del aire acondicionado en verano — y dejarla ahí todo el año.',
      ),
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
      p(
        'Llamadas "orquídeas pensamiento" por el llamativo dibujo de sus flores, las Miltonia brasileñas son algo más exigentes que sus parientes Oncidium: no toleran secarse del todo entre riegos ni el agua con mucha sal o cloro, algo para tener en cuenta con el agua de red del AMBA.',
      ),
      h('Luz'),
      p(
        'Necesitan luz media, más tenue que la de una Cattleya. Hojas en forma de abanico y de un verde claro son señal de buena luz; si se ven verde oscuro, les está faltando.',
      ),
      h('Riego y sustrato'),
      p(
        'A diferencia de la mayoría de las orquídeas de esta lista, no les gusta secarse por completo: conviene mantener el sustrato apenas húmedo todo el tiempo, sin encharcar, regando 2 a 3 veces por semana. En los días de calor extremo del verano porteño puede hacer falta regar día por medio; en invierno alcanza con una vez por semana. Si el agua de la canilla es muy dura, mejor usar agua filtrada o de lluvia. Una mezcla fina de corteza de pino con musgo sphagnum retiene bien la humedad pareja que necesitan, siempre con buen drenaje.',
      ),
      h('Temperatura y humedad'),
      p(
        'Prefieren un rango intermedio, sin extremos: 18–25°C de día y 13–16°C de noche. Los veranos muy calurosos de Buenos Aires (por encima de 30°C) les cuestan, así que conviene buscarles sombra y buena ventilación esos días. Necesitan bastante humedad, entre 60 y 80% — el verano húmedo porteño ayuda, pero en invierno con calefacción conviene reforzar con una bandeja de agua o un humidificador. La ventilación es clave, porque la combinación de sustrato siempre húmedo y poca circulación de aire favorece los hongos en hojas y raíces.',
      ),
      h('Floración'),
      p(
        'Florecen generalmente en primavera-verano (octubre a enero en Buenos Aires), con flores muy vistosas que pueden durar varias semanas.',
      ),
      h('Trasplante'),
      p(
        'Cada 1 a 2 años — su sustrato fino se compacta más rápido que el de otras orquídeas, así que conviene no dejarlo pasar demasiado.',
      ),
      h('Cuidado con el calor porteño'),
      p(
        'De las orquídeas de esta lista, es de las más sensibles al calor extremo del verano bonaerense, más incluso que al frío del invierno. En los días de más de 30°C conviene alejarlas del sol directo y reforzar la ventilación para que no sufran estrés térmico.',
      ),
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
      p(
        'Conocida como "dama bailarina" por la forma de sus flores, es uno de los géneros más agradecidos y de floración más abundante. Se adapta muy bien al clima de Buenos Aires y es una excelente opción para quien recién empieza a coleccionar.',
      ),
      h('Luz'),
      p(
        'Necesita luz brillante, similar a la de una Cattleya, incluyendo algo de sol suave de mañana. Con poca luz da plantas de un verde muy oscuro que no florecen.',
      ),
      h('Riego y sustrato'),
      p(
        'Regá bien y dejá secar el sustrato entre riegos, aunque no tan a fondo como con una Cattleya — sus raíces finas no toleran quedarse secas mucho tiempo. En verano esto suele ser cada 4 a 5 días, y en invierno cada 8 a 10. Va bien con corteza de pino de grano medio y buen drenaje; las variedades de pseudobulbos pequeños también se dan muy bien montadas sobre placas de corcho.',
      ),
      h('Temperatura y humedad'),
      p(
        'Tiene un rango de tolerancia amplio: 18–28°C de día y 12–16°C de noche, lo que coincide bastante bien con el clima porteño entre septiembre y mayo. Le alcanza con 50–70% de humedad y buena circulación de aire — se maneja bien con la humedad natural de Buenos Aires la mayor parte del año, y esa ventilación además ayuda a secar rápido las raíces finas después de regar.',
      ),
      h('Floración'),
      p(
        'Florece generalmente en otoño (marzo a mayo en Buenos Aires), con varas ramificadas que llevan decenas de flores pequeñas y vistosas; algunos híbridos florecen más de una vez al año.',
      ),
      h('Trasplante'),
      p(
        'Cada 1 a 2 años, cuando el pseudobulbo más nuevo empieza a formar raíces — no hace falta esperar a que el sustrato se vea mal.',
      ),
      h('Invierno porteño'),
      p(
        'Tolera el fresco mejor que una Cattleya, pero igual conviene protegerla de las heladas de junio y julio en el Gran Buenos Aires: un lugar luminoso contra una pared o bajo un alero alcanza en la mayoría de los casos.',
      ),
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
      p(
        'Se la reconoce por sus hojas cilíndricas, parecidas a lápices, que almacenan agua y la hacen bastante tolerante a la sequía entre riegos. Su especie más conocida, Brassavola nodosa, perfuma intensamente de noche para atraer polinizadores — un detalle que vale la pena aprovechar teniéndola cerca de un living o una galería.',
      ),
      h('Luz'),
      p(
        'Es de las que más luz necesitan de esta lista, incluyendo varias horas de sol directo suave. Un balcón o patio con sol de mañana le sienta muy bien en primavera-verano.',
      ),
      h('Riego y sustrato'),
      p(
        'Regá bien y dejá secar el sustrato casi por completo entre riegos — sus hojas gruesas toleran mejor la falta de agua que el exceso, y es de las orquídeas más indulgentes con quien se olvida de regar de vez en cuando. En primavera-verano esto suele ser cada 5 a 7 días, y en invierno cada 12 a 15. Le va bien la corteza de pino en trozos medianos con muy buen drenaje, o directamente montada sobre corcho o madera, imitando cómo crece sobre troncos en la naturaleza.',
      ),
      h('Temperatura y humedad'),
      p(
        'Le gusta el calor: 20–30°C de día y no menos de 14°C de noche, y es de las que mejor tolera los días más calurosos del verano bonaerense. Se conforma con humedad moderada (40–60%), más baja que la mayoría — otra ventaja para el aire seco del invierno porteño en interior. Si se monta sobre placa, conviene buena circulación de aire para que las raíces expuestas sequen rápido después de regar.',
      ),
      h('Floración'),
      p(
        'Florece generalmente en verano (diciembre a marzo en Buenos Aires), de noche, con un perfume cítrico intenso que se siente en toda la habitación o el patio.',
      ),
      h('Trasplante'),
      p(
        'Cada 2 a 3 años si está en maceta; si está montada sobre placa, prácticamente no hace falta trasplantarla — solo renovar el soporte cuando se deteriora.',
      ),
      h('Invierno porteño'),
      p(
        'Aunque tolera bien el calor, no le gustan las heladas: por debajo de los 10°C conviene resguardarla en un lugar protegido y luminoso durante junio, julio y agosto.',
      ),
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
      p(
        'Con sus raíces gruesas y expuestas al aire, y flores enormes y coloridas, la Vanda es la orquídea más espectacular — y también la más exigente — de esta lista. Es de origen tropical y necesita calor y humedad constantes durante todo el año, algo que el clima de Buenos Aires no ofrece de forma natural en invierno.',
      ),
      h('Luz'),
      p(
        'Necesita muchísima luz, incluyendo varias horas de sol directo. Se cultiva típicamente colgada, en canasto o cesto y sin sustrato, con las raíces al aire libre.',
      ),
      h('Riego y sustrato'),
      p(
        'Como no tiene sustrato que retenga agua, se riega — o se moja por completo, raíces incluidas — todos los días en los meses cálidos, dejando que las raíces sequen en un par de horas: es un riego bastante distinto al de cualquier otra orquídea de esta lista. No lleva sustrato: se cultiva a raíz desnuda en canastos de madera o colgada directamente.',
      ),
      h('Temperatura y humedad'),
      p(
        'Necesita calor constante en cualquier época del año: 22–32°C de día y no menos de 16°C de noche. El invierno porteño, con mínimas de 5–9°C, está muy por debajo de lo que tolera sin protección. También pide humedad alta y constante (60–80%), con riegos o nebulizaciones frecuentes para compensar que las raíces quedan expuestas al aire seco, y una ventilación constante pero suave — la combinación de raíces siempre húmedas y aire estancado le resulta fatal.',
      ),
      h('Floración'),
      p(
        'Puede florecer más de una vez al año si las condiciones son buenas, con flores grandes que duran varias semanas.',
      ),
      h('Trasplante'),
      p(
        'No aplica en el sentido tradicional: al no tener sustrato, solo hay que renovar o agrandar el canasto cuando la planta lo supera.',
      ),
      h('El gran desafío porteño: el invierno'),
      p(
        'Es, sin dudas, la orquídea menos apta para el clima de Buenos Aires sin ayuda: necesita un invernáculo con calefacción y humedad controlada entre mayo y septiembre para pasar el invierno. Sin ese tipo de instalación, conviene reservarla para cultivadores con más experiencia e infraestructura, o mantenerla en un ambiente interior muy luminoso y húmedo — un baño con buena luz, por ejemplo — durante los meses fríos.',
      ),
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
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
