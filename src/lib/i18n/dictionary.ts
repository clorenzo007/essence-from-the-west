import type { Locale } from '@/lib/i18n/locales'

/**
 * Traducciones de la interfaz fija del sitio (menús, botones, encabezados
 * de sección, FAQ, etc). El contenido real — nombres y descripciones de
 * productos, guías de cultivo, posts del blog — permanece solo en español
 * en Payload; estas traducciones cubren únicamente el texto "de marca"
 * que ya estaba hardcodeado en los componentes.
 */
export type UiDictionary = {
  nav: {
    catalog: string
    care: string
    journal: string
    viewCollection: string
    menu: string
    close: string
  }
  hero: {
    label: string
    title1: string
    title2: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  editorial: {
    label: string
    title1: string
    title2: string
    body: string
    link: string
  }
  featured: {
    label: string
    titleProducts: string
    descProducts: string
    titleFallback: string
    descFallback: string
    viewAll: string
    noResults: string
  }
  carePreview: {
    label: string
    title: string
    desc: string
    topics: [string, string, string, string]
    viewAll: string
  }
  newsletter: {
    label: string
    title: string
    body: string
    cta: string
  }
  footer: {
    explore: string
    contact: string
    whatsapp: string
    visits: string
  }
  catalog: {
    badge: string
    title: string
    desc: string
    searchLabel: string
    searchPlaceholder: string
    difficultyLabel: string
    difficultyAll: string
    diffBeginner: string
    diffIntermediate: string
    diffAdvanced: string
    diffExpert: string
    filterBtn: string
    noResults: string
    faqLabel: string
    faqTitle: string
    faqs: { question: string; answer: string }[]
  }
  careList: {
    title: string
    desc: string
    emptyText: string
  }
  careDetail: {
    difficulty: string
    light: string
    humidity: string
    temperature: string
    wateringTips: string
    fertilizerTips: string
    backLink: string
  }
  blogList: {
    label: string
    title: string
    desc: string
    draft: string
    readMore: string
    emptyText: string
  }
  blogDetail: {
    backLink: string
  }
  productDetail: {
    available: string
    soldOut: string
    species: string
    hybrid: string
    flowering: string
    fragrance: string
    whatsappCta: string
  }
}

const en: UiDictionary = {
  nav: {
    catalog: 'Collection',
    care: 'Care',
    journal: 'Journal',
    viewCollection: 'View Collection',
    menu: 'Menu',
    close: 'Close',
  },
  hero: {
    label: "Collector's Orchids",
    title1: 'Orchids',
    title2: 'Worth Collecting',
    subtitle: 'Species and hybrids selected for collectors and enthusiasts.',
    primaryCta: 'View Collection',
    secondaryCta: 'About Reserva Oeste',
  },
  editorial: {
    label: 'Reserva Oeste',
    title1: 'A collection,',
    title2: 'not a nursery',
    body: "Each specimen is selected for its character, its flower, and its merit within a private collection. We don't sell mass-produced plants — we offer pieces for those who grow with passion and contemplation.",
    link: 'Read the journal →',
  },
  featured: {
    label: 'Selection',
    titleProducts: 'Featured Specimens',
    descProducts: 'Chosen pieces from the collection, ready for the discerning collector.',
    titleFallback: 'Explore by Genus',
    descFallback:
      'Collector orchids — Cattleya, Vanda, Phalaenopsis and more — each with its own character and flower.',
    viewAll: 'View all →',
    noResults: 'No featured specimens yet.',
  },
  carePreview: {
    label: 'Knowledge',
    title: 'Growing Guides',
    desc: 'Specific notes for serious growers — from intermediate Cattleya to demanding species.',
    topics: ['Humidity & Air Flow', 'Light for Blooming', 'Repotting Rhythm', 'Seasonal Watering'],
    viewAll: 'All Guides',
  },
  newsletter: {
    label: 'Private Inquiry',
    title: 'Reserve Your Specimen by Message',
    body: "Each orchid is offered individually. Choose a piece from the collection and message us — we'll confirm availability and arrange delivery with the utmost care.",
    cta: 'View Collection',
  },
  footer: {
    explore: 'Explore',
    contact: 'Contact',
    whatsapp: 'Inquiries via WhatsApp',
    visits: 'Visits by appointment',
  },
  catalog: {
    badge: 'Orchids for Sale · Ituzaingó, West Buenos Aires',
    title: 'The Collection',
    desc: 'Browse available specimens for collectors in Ituzaingó and the greater West Buenos Aires area. Each piece is unique within our selection.',
    searchLabel: 'Search',
    searchPlaceholder: 'Name, species...',
    difficultyLabel: 'Difficulty',
    difficultyAll: 'All',
    diffBeginner: 'Beginner',
    diffIntermediate: 'Intermediate',
    diffAdvanced: 'Advanced',
    diffExpert: 'Expert',
    filterBtn: 'Filter',
    noResults: 'No specimens match your search.',
    faqLabel: 'Frequently Asked Questions',
    faqTitle: 'Orchids for Sale in West Buenos Aires',
    faqs: [
      {
        question: 'Where can I buy orchids in Ituzaingó and West Buenos Aires?',
        answer:
          'At Reserva Oeste, based in Ituzaingó. We sell collector orchids to collectors and enthusiasts throughout West Greater Buenos Aires — Ituzaingó, Morón, Hurlingham, Merlo and surrounding areas.',
      },
      {
        question: 'How do I buy an orchid?',
        answer:
          "Choose a specimen from the collection and message us on WhatsApp to confirm availability. We'll arrange payment and delivery or pickup by appointment.",
      },
      {
        question: 'Do you ship or deliver in West Buenos Aires?',
        answer:
          'Yes, we arrange delivery or pickup by appointment within Ituzaingó and West Greater Buenos Aires. Message us on WhatsApp to see options for your area.',
      },
    ],
  },
  careList: {
    title: 'Growing Guides',
    desc: 'Detailed cultural notes by genus and alliance.',
    emptyText: 'Guides will appear here once published.',
  },
  careDetail: {
    difficulty: 'Difficulty',
    light: 'Light',
    humidity: 'Humidity',
    temperature: 'Temperature',
    wateringTips: '💧 Watering tips',
    fertilizerTips: '🌿 Fertilizing tips',
    backLink: '← All guides',
  },
  blogList: {
    label: 'Journal',
    title: 'Botanical Journal',
    desc: 'Growing notes, seasons, and stories from the collection.',
    draft: 'Draft',
    readMore: 'Read →',
    emptyText: 'Published entries will appear here.',
  },
  blogDetail: {
    backLink: '← Back to journal',
  },
  productDetail: {
    available: 'Available',
    soldOut: 'Sold Out',
    species: 'Species',
    hybrid: 'Hybrid',
    flowering: 'Flowering',
    fragrance: 'Fragrance',
    whatsappCta: 'Inquire via WhatsApp',
  },
}

const fr: UiDictionary = {
  nav: {
    catalog: 'Collection',
    care: 'Entretien',
    journal: 'Journal',
    viewCollection: 'Voir la collection',
    menu: 'Menu',
    close: 'Fermer',
  },
  hero: {
    label: 'Orchidées de Collection',
    title1: 'Orchidées',
    title2: 'de Collection',
    subtitle:
      'Espèces et hybrides sélectionnés pour les collectionneurs et les passionnés.',
    primaryCta: 'Voir la collection',
    secondaryCta: 'Découvrir Reserva Oeste',
  },
  editorial: {
    label: 'Reserva Oeste',
    title1: 'Une collection,',
    title2: 'pas une pépinière',
    body: "Chaque spécimen est sélectionné pour son caractère, sa fleur et son mérite au sein d'une collection privée. Nous ne vendons pas de plantes en série : nous proposons des pièces pour ceux qui cultivent avec passion et contemplation.",
    link: 'Lire le journal →',
  },
  featured: {
    label: 'Sélection',
    titleProducts: 'Spécimens en vedette',
    descProducts: 'Pièces choisies de la collection, prêtes pour le collectionneur exigeant.',
    titleFallback: 'Explorer par genre',
    descFallback:
      'Orchidées de collection — Cattleya, Vanda, Phalaenopsis et plus — chacune avec son propre caractère et sa fleur.',
    viewAll: 'Voir tout →',
    noResults: 'Pas encore de spécimens en vedette.',
  },
  carePreview: {
    label: 'Connaissances',
    title: 'Guides de culture',
    desc: 'Notes spécifiques pour les cultivateurs sérieux — du Cattleya intermédiaire aux espèces exigeantes.',
    topics: [
      'Humidité et circulation',
      'Lumière pour la floraison',
      'Rythme de rempotage',
      'Arrosage saisonnier',
    ],
    viewAll: 'Tous les guides',
  },
  newsletter: {
    label: 'Consultation privée',
    title: 'Réservez votre spécimen par message',
    body: 'Chaque orchidée est proposée individuellement. Choisissez une pièce de la collection et contactez-nous — nous confirmons la disponibilité et organisons la livraison avec le plus grand soin.',
    cta: 'Voir la collection',
  },
  footer: {
    explore: 'Explorer',
    contact: 'Contact',
    whatsapp: 'Renseignements via WhatsApp',
    visits: 'Visites sur rendez-vous',
  },
  catalog: {
    badge: "Vente d'orchidées · Ituzaingó, Ouest de Buenos Aires",
    title: 'La collection',
    desc: "Découvrez les spécimens disponibles pour les collectionneurs d'Ituzaingó et de tout l'ouest du Grand Buenos Aires. Chaque pièce est unique au sein de notre sélection.",
    searchLabel: 'Rechercher',
    searchPlaceholder: 'Nom, espèce...',
    difficultyLabel: 'Difficulté',
    difficultyAll: 'Toutes',
    diffBeginner: 'Débutant',
    diffIntermediate: 'Intermédiaire',
    diffAdvanced: 'Avancé',
    diffExpert: 'Expert',
    filterBtn: 'Filtrer',
    noResults: 'Aucun spécimen ne correspond à votre recherche.',
    faqLabel: 'Questions fréquentes',
    faqTitle: "Vente d'orchidées dans l'ouest de Buenos Aires",
    faqs: [
      {
        question: "Où acheter des orchidées à Ituzaingó et dans l'ouest de Buenos Aires ?",
        answer:
          "Chez Reserva Oeste, basé à Ituzaingó. Nous vendons des orchidées de collection aux collectionneurs et passionnés de tout l'ouest du Grand Buenos Aires — Ituzaingó, Morón, Hurlingham, Merlo et environs.",
      },
      {
        question: 'Comment acheter une orchidée ?',
        answer:
          'Choisissez un spécimen dans la collection et écrivez-nous sur WhatsApp pour confirmer la disponibilité. Nous organisons le paiement et la livraison ou le retrait sur rendez-vous.',
      },
      {
        question: "Faites-vous des livraisons dans l'ouest de Buenos Aires ?",
        answer:
          "Oui, nous organisons la livraison ou le retrait sur rendez-vous à Ituzaingó et dans l'ouest du Grand Buenos Aires. Écrivez-nous sur WhatsApp pour connaître les options selon votre localité.",
      },
    ],
  },
  careList: {
    title: 'Guides de culture',
    desc: 'Notes culturelles détaillées par genre et alliance.',
    emptyText: 'Les guides apparaîtront ici une fois publiés.',
  },
  careDetail: {
    difficulty: 'Difficulté',
    light: 'Lumière',
    humidity: 'Humidité',
    temperature: 'Température',
    wateringTips: "💧 Conseils d'arrosage",
    fertilizerTips: '🌿 Conseils de fertilisation',
    backLink: '← Tous les guides',
  },
  blogList: {
    label: 'Journal',
    title: 'Journal botanique',
    desc: 'Culture, saisons et récits de la collection.',
    draft: 'Brouillon',
    readMore: 'Lire →',
    emptyText: 'Les articles publiés apparaîtront ici.',
  },
  blogDetail: {
    backLink: '← Retour au journal',
  },
  productDetail: {
    available: 'Disponible',
    soldOut: 'Épuisé',
    species: 'Espèce',
    hybrid: 'Hybride',
    flowering: 'Floraison',
    fragrance: 'Parfum',
    whatsappCta: 'Contacter via WhatsApp',
  },
}

const pt: UiDictionary = {
  nav: {
    catalog: 'Coleção',
    care: 'Cuidados',
    journal: 'Diário',
    viewCollection: 'Ver Coleção',
    menu: 'Menu',
    close: 'Fechar',
  },
  hero: {
    label: 'Orquídeas de Coleção',
    title1: 'Orquídeas',
    title2: 'de Coleção',
    subtitle: 'Espécies e híbridos selecionados para colecionadores e entusiastas.',
    primaryCta: 'Ver Coleção',
    secondaryCta: 'Conheça a Reserva Oeste',
  },
  editorial: {
    label: 'Reserva Oeste',
    title1: 'Uma coleção,',
    title2: 'não um viveiro',
    body: 'Cada exemplar é selecionado por seu caráter, sua flor e seu mérito dentro de uma coleção privada. Não vendemos plantas em série: oferecemos peças para quem cultiva com paixão e contemplação.',
    link: 'Ler o diário →',
  },
  featured: {
    label: 'Seleção',
    titleProducts: 'Exemplares em destaque',
    descProducts: 'Peças escolhidas da coleção, prontas para o colecionador exigente.',
    titleFallback: 'Explore por gênero',
    descFallback:
      'Orquídeas de coleção — Cattleya, Vanda, Phalaenopsis e mais — cada uma com seu próprio caráter e sua flor.',
    viewAll: 'Ver tudo →',
    noResults: 'Ainda não há exemplares em destaque.',
  },
  carePreview: {
    label: 'Conhecimento',
    title: 'Guias de cultivo',
    desc: 'Notas específicas para cultivadores sérios — de Cattleya intermediárias a espécies exigentes.',
    topics: ['Umidade e circulação', 'Luz para floração', 'Ritmo de replantio', 'Rega sazonal'],
    viewAll: 'Todos os guias',
  },
  newsletter: {
    label: 'Consulta privada',
    title: 'Reserve seu exemplar por mensagem',
    body: 'Cada orquídea é oferecida individualmente. Escolha uma peça da coleção e fale conosco — confirmamos a disponibilidade e organizamos a entrega com o máximo cuidado.',
    cta: 'Ver Coleção',
  },
  footer: {
    explore: 'Explorar',
    contact: 'Contato',
    whatsapp: 'Consultas via WhatsApp',
    visits: 'Visitas com hora marcada',
  },
  catalog: {
    badge: 'Venda de orquídeas · Ituzaingó, Zona Oeste de Buenos Aires',
    title: 'A coleção',
    desc: 'Explore exemplares disponíveis para colecionadores de Ituzaingó e de toda a Zona Oeste da Grande Buenos Aires. Cada peça é única dentro da nossa seleção.',
    searchLabel: 'Buscar',
    searchPlaceholder: 'Nome, espécie...',
    difficultyLabel: 'Dificuldade',
    difficultyAll: 'Todas',
    diffBeginner: 'Iniciante',
    diffIntermediate: 'Intermediário',
    diffAdvanced: 'Avançado',
    diffExpert: 'Especialista',
    filterBtn: 'Filtrar',
    noResults: 'Nenhum exemplar corresponde à sua busca.',
    faqLabel: 'Perguntas frequentes',
    faqTitle: 'Venda de orquídeas na Zona Oeste',
    faqs: [
      {
        question: 'Onde comprar orquídeas em Ituzaingó e na Zona Oeste da Grande Buenos Aires?',
        answer:
          'Na Reserva Oeste, localizada em Ituzaingó. Vendemos orquídeas de coleção para colecionadores e entusiastas de toda a Zona Oeste da Grande Buenos Aires — Ituzaingó, Morón, Hurlingham, Merlo e arredores.',
      },
      {
        question: 'Como comprar uma orquídea?',
        answer:
          'Escolha o exemplar na coleção e nos escreva pelo WhatsApp para confirmar a disponibilidade. Combinamos o pagamento e a entrega ou retirada com hora marcada.',
      },
      {
        question: 'Vocês fazem entregas na Zona Oeste?',
        answer:
          'Sim, combinamos entrega ou retirada com hora marcada dentro de Ituzaingó e da Zona Oeste da Grande Buenos Aires. Escreva-nos pelo WhatsApp para ver as opções conforme sua localidade.',
      },
    ],
  },
  careList: {
    title: 'Guias de cultivo',
    desc: 'Notas culturais detalhadas por gênero e aliança.',
    emptyText: 'Os guias aparecerão aqui quando forem publicados.',
  },
  careDetail: {
    difficulty: 'Dificuldade',
    light: 'Luz',
    humidity: 'Umidade',
    temperature: 'Temperatura',
    wateringTips: '💧 Dicas de rega',
    fertilizerTips: '🌿 Dicas de adubação',
    backLink: '← Todos os guias',
  },
  blogList: {
    label: 'Diário',
    title: 'Editorial botânico',
    desc: 'Cultivo, estação e relatos da coleção.',
    draft: 'Rascunho',
    readMore: 'Ler →',
    emptyText: 'As publicações aparecerão aqui.',
  },
  blogDetail: {
    backLink: '← Voltar ao diário',
  },
  productDetail: {
    available: 'Disponível',
    soldOut: 'Esgotado',
    species: 'Espécie',
    hybrid: 'Híbrido',
    flowering: 'Floração',
    fragrance: 'Fragrância',
    whatsappCta: 'Consultar via WhatsApp',
  },
}

export const DICTIONARIES: Record<Locale, UiDictionary> = { en, fr, pt }

export function getDictionary(locale?: Locale): UiDictionary | null {
  return locale ? DICTIONARIES[locale] : null
}
