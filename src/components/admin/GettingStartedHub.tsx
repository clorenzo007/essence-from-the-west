'use client'

import type { CSSProperties } from 'react'
import { useState } from 'react'

/**
 * Guía de inicio del panel — pantalla tipo "¿qué querés hacer?" que se
 * muestra arriba del dashboard por defecto de Payload (que sigue debajo,
 * con la lista automática de colecciones agrupadas).
 *
 * Pensada para alguien que recién empieza a cargar información del vivero
 * y no tiene por qué saber de memoria qué colección usar para cada cosa.
 * Registrada en `admin.components.beforeDashboard`.
 */

type ActionCard = {
  title: string
  description: string
  href: string
  cta: string
}

type Section = {
  title: string
  cards: ActionCard[]
}

const SECTIONS: Section[] = [
  {
    title: 'Cargar información de tus plantas',
    cards: [
      {
        title: 'Orquídea nueva',
        description:
          'Una ficha de venta para la tienda. Cada orquídea que cargues acá es un producto que tus clientes pueden ver y comprar.',
        href: '/admin/collections/products/create',
        cta: 'Cargar orquídea',
      },
      {
        title: 'Guía de cuidados',
        description:
          'Instrucciones de cultivo por especie o alianza — riego, luz, humedad. Se muestran en el sitio para cualquiera que quiera aprender a cuidar sus orquídeas.',
        href: '/admin/collections/care-sheets/create',
        cta: 'Escribir guía',
      },
      {
        title: 'Ejemplar propio',
        description:
          'Tu bitácora personal de cultivo: floraciones, cuidados y fotos de cada planta que tenés vos. Es uso interno — nunca se muestra en el sitio público.',
        href: '/admin/collections/specimens/create',
        cta: 'Registrar ejemplar',
      },
    ],
  },
  {
    title: 'Catálogo y tienda',
    cards: [
      {
        title: 'Categoría',
        description: 'Agrupa las orquídeas por género o alianza para que se puedan filtrar en el catálogo.',
        href: '/admin/collections/categories/create',
        cta: 'Crear categoría',
      },
      {
        title: 'Insumo',
        description: 'Sustratos, macetas, fertilizantes y otros productos que vendés además de las plantas.',
        href: '/admin/collections/supplies/create',
        cta: 'Cargar insumo',
      },
    ],
  },
  {
    title: 'Contenido del sitio',
    cards: [
      {
        title: 'Publicación de blog',
        description: 'Novedades, consejos, historias del vivero — artículos que aparecen en la sección de blog.',
        href: '/admin/collections/blog-posts/create',
        cta: 'Escribir publicación',
      },
      {
        title: 'Archivo multimedia',
        description: 'Fotos y otros archivos que después usás en fichas, guías y publicaciones.',
        href: '/admin/collections/media/create',
        cta: 'Subir archivo',
      },
    ],
  },
  {
    title: 'Administración',
    cards: [
      {
        title: 'Cliente',
        description: 'Base de datos de contactos y pedidos por WhatsApp.',
        href: '/admin/collections/customers/create',
        cta: 'Agregar cliente',
      },
      {
        title: 'Usuario del panel',
        description: 'Quién puede entrar acá y con qué permisos (administrador o editor).',
        href: '/admin/collections/users/create',
        cta: 'Invitar usuario',
      },
    ],
  },
]

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: '¿En qué se diferencia una Orquídea de un Ejemplar?',
    a: 'Una Orquídea es una ficha de venta: la ve cualquiera que entre a la tienda y se puede comprar. Un Ejemplar es tuyo — un registro privado de una planta que tenés en tu colección personal, con su propio historial de floraciones y cuidados. No se muestra nunca en el sitio público, aunque se trate de la misma especie que vendés.',
  },
  {
    q: '¿Qué significa cada Estado (Borrador / Publicado / Archivado)?',
    a: 'Borrador: todavía la estás armando, no aparece en el sitio. Publicado: ya está visible para cualquiera que entre a la tienda o al sitio. Archivado: existió pero la sacaste de circulación — queda guardada en el panel pero no se muestra públicamente.',
  },
  {
    q: '¿Cómo veo algo que acabo de publicar tal como lo va a ver un cliente?',
    a: 'Cuando guardás algo con Estado = Publicado, te va a aparecer un aviso ofreciéndote abrir esa página en la tienda. También podés ir directo a la sección correspondiente del sitio en cualquier momento.',
  },
]

export function GettingStartedHub() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div style={wrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>¿Qué querés hacer?</h2>
        <p style={introStyle}>
          Guía rápida para cargar información en el sitio. Elegí abajo lo que necesitás y te lleva directo al
          formulario correspondiente.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{section.title}</h3>
          <div style={cardsGridStyle}>
            {section.cards.map((card) => (
              <a key={card.title} href={card.href} style={cardStyle}>
                <div style={cardTitleStyle}>{card.title}</div>
                <p style={cardDescriptionStyle}>{card.description}</p>
                <span style={cardCtaStyle}>{card.cta} →</span>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div style={faqSectionStyle}>
        <h3 style={sectionTitleStyle}>Preguntas frecuentes</h3>
        {FAQ.map((item, index) => {
          const isOpen = faqOpen === index
          return (
            <div key={item.q} style={faqItemStyle}>
              <button
                type="button"
                onClick={() => setFaqOpen(isOpen ? null : index)}
                style={faqQuestionStyle}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span aria-hidden style={faqToggleStyle}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && <p style={faqAnswerStyle}>{item.a}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const wrapStyle: CSSProperties = {
  margin: '0 32px 24px',
  padding: '20px 24px',
  border: '1px solid rgb(31 31 31 / 10%)',
  borderRadius: 6,
  backgroundColor: 'var(--theme-elevation-0)',
}

const headerStyle: CSSProperties = {
  marginBottom: 20,
}

const titleStyle: CSSProperties = {
  margin: '0 0 6px',
  fontSize: 20,
  fontWeight: 600,
}

const introStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  color: 'var(--theme-elevation-600, #5c5c5c)',
  maxWidth: 640,
}

const sectionStyle: CSSProperties = {
  marginBottom: 20,
}

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--theme-elevation-500, #8a8a8a)',
}

const cardsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 12,
}

const cardStyle: CSSProperties = {
  display: 'block',
  padding: '14px 16px',
  border: '1px solid rgb(31 31 31 / 12%)',
  borderRadius: 4,
  textDecoration: 'none',
  color: 'inherit',
  backgroundColor: 'var(--theme-bg, #fff)',
}

const cardTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 4,
}

const cardDescriptionStyle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--theme-elevation-600, #5c5c5c)',
}

const cardCtaStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#8a6d3b',
}

const faqSectionStyle: CSSProperties = {
  marginTop: 24,
  paddingTop: 16,
  borderTop: '1px solid rgb(31 31 31 / 10%)',
}

const faqItemStyle: CSSProperties = {
  borderBottom: '1px solid rgb(31 31 31 / 8%)',
}

const faqQuestionStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 0',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  textAlign: 'left',
  color: 'inherit',
}

const faqToggleStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: 16,
  color: 'var(--theme-elevation-500, #8a8a8a)',
}

const faqAnswerStyle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: 12,
  lineHeight: 1.6,
  color: 'var(--theme-elevation-600, #5c5c5c)',
}
