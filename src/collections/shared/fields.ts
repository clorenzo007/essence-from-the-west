import type { CollectionBeforeValidateHook, Field, FieldHook, Tab } from 'payload'

import { slugify } from '@/lib/utils'

import type { SlugSourceField } from './options'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createAutoGenerateSlugHook(sourceField: SlugSourceField): FieldHook {
  return ({ data, operation, value, originalDoc }) => {
    if (operation === 'update' && originalDoc?.slug && !value) {
      return originalDoc.slug
    }

    if (value && typeof value === 'string' && value.trim().length > 0) {
      return slugify(value)
    }

    const source = data?.[sourceField]
    if (source && typeof source === 'string') {
      return slugify(source)
    }

    return value
  }
}

export const validateSlugFormat: FieldHook = ({ value }) => {
  if (!value || typeof value !== 'string') return value

  if (!SLUG_PATTERN.test(value)) {
    throw new Error('El slug solo puede tener minúsculas, números y guiones medios.')
  }

  return value
}

type MetaSyncConfig = {
  titleField: SlugSourceField | 'title'
  descriptionField: string
}

export function createMetaSyncHook(config: MetaSyncConfig): CollectionBeforeValidateHook {
  return ({ data }) => {
    if (!data || typeof data !== 'object') return data

    const meta = (data.meta as Record<string, unknown> | undefined) ?? {}
    const titleSource = data[config.titleField]

    if (!meta.title && titleSource && typeof titleSource === 'string') {
      meta.title = titleSource
    }

    const descriptionSource = data[config.descriptionField]
    if (!meta.description && descriptionSource && typeof descriptionSource === 'string') {
      meta.description = descriptionSource.slice(0, 160)
    }

    data.meta = meta
    return data
  }
}

export function createSlugField(sourceField: SlugSourceField): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: `Se genera automáticamente a partir de "${sourceField}" al crear. Editalo solo si hace falta.`,
    },
    hooks: {
      beforeValidate: [createAutoGenerateSlugHook(sourceField), validateSlugFormat],
    },
  }
}

export function createSeoTabFields(): Tab {
  return {
    label: 'SEO',
    description: 'Metadatos para buscadores y redes sociales en las páginas del sitio.',
    fields: [
      {
        name: 'meta',
        type: 'group',
        fields: [
          {
            name: 'title',
            type: 'text',
            maxLength: 60,
            admin: { description: 'Título de la página. Máximo 60 caracteres.' },
          },
          {
            name: 'description',
            type: 'textarea',
            maxLength: 160,
            admin: { description: 'Meta descripción. Máximo 160 caracteres.' },
          },
          {
            name: 'keywords',
            type: 'text',
            admin: { description: 'Palabras clave separadas por coma.' },
          },
          {
            name: 'ogImage',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Imagen para compartir en redes sociales.' },
          },
          {
            name: 'noIndex',
            type: 'checkbox',
            defaultValue: false,
            admin: { description: 'Evita que los buscadores indexen esta página.' },
          },
        ],
      },
    ],
  }
}

export { publishedReadAccess } from './access'

export const publicReadAccess = {
  read: () => true,
}
