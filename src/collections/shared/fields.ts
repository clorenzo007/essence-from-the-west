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
    throw new Error('Slug must be lowercase letters, numbers, and hyphens only.')
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
      description: `Auto-generated from ${sourceField} on create. Edit only if needed.`,
    },
    hooks: {
      beforeValidate: [createAutoGenerateSlugHook(sourceField), validateSlugFormat],
    },
  }
}

export function createSeoTabFields(): Tab {
  return {
    label: 'SEO',
    description: 'Search and social metadata for Next.js pages.',
    fields: [
      {
        name: 'meta',
        type: 'group',
        fields: [
          {
            name: 'title',
            type: 'text',
            maxLength: 60,
            admin: { description: 'Page title. Max 60 characters.' },
          },
          {
            name: 'description',
            type: 'textarea',
            maxLength: 160,
            admin: { description: 'Meta description. Max 160 characters.' },
          },
          {
            name: 'keywords',
            type: 'text',
            admin: { description: 'Comma-separated keywords.' },
          },
          {
            name: 'ogImage',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Social share image.' },
          },
          {
            name: 'noIndex',
            type: 'checkbox',
            defaultValue: false,
            admin: { description: 'Prevent search engines from indexing this page.' },
          },
        ],
      },
    ],
  }
}

export const publishedReadAccess = {
  read: ({ req }: { req: { user?: unknown } }) => {
    if (req.user) return true
    return { status: { equals: 'published' as const } }
  },
}

export const publicReadAccess = {
  read: () => true,
}
