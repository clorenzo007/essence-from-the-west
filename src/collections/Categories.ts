import type { CollectionConfig, Field } from 'payload'

import { validatePublishedCategory } from './categories/hooks'
import {
  createMetaSyncHook,
  createSeoTabFields,
  createSlugField,
  publishedReadAccess,
} from './shared/fields'
import { CONTENT_STATUS_OPTIONS } from './shared/options'

const sidebarFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    defaultValue: 'draft',
    required: true,
    options: [...CONTENT_STATUS_OPTIONS],
    admin: {
      position: 'sidebar',
      description: 'Only published categories appear in catalog filters.',
    },
  },
  createSlugField('name'),
  {
    name: 'sortOrder',
    type: 'number',
    defaultValue: 0,
    admin: {
      position: 'sidebar',
      description: 'Lower numbers appear first in navigation and filters.',
    },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Highlight in catalog navigation.',
    },
  },
]

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'slug', 'status', 'sortOrder', 'featured', 'updatedAt'],
    description: 'Orchid taxonomy for catalog organization and filtering.',
    listSearchableFields: ['name', 'slug', 'description', 'shortDescription'],
    pagination: { defaultLimit: 25 },
  },
  access: publishedReadAccess,
  hooks: {
    beforeValidate: [
      validatePublishedCategory,
      createMetaSyncHook({ titleField: 'name', descriptionField: 'shortDescription' }),
    ],
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          description: 'Category identity and customer-facing copy.',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              minLength: 2,
              maxLength: 80,
              admin: {
                description: 'Display name (e.g. Phalaenopsis, Cattleya Alliance).',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 160,
              admin: {
                description: 'Brief summary for catalog filters and SEO fallback.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Optional editorial content about this genus or alliance.',
              },
            },
          ],
        },
        {
          label: 'Media',
          description: 'Visual identity for category pages.',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero image for category landing pages.',
              },
            },
          ],
        },
        createSeoTabFields(),
      ],
    },
  ],
}
