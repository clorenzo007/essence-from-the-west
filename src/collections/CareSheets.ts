import type { CollectionConfig, Field } from 'payload'

import { validatePublishedCareSheet } from './care-sheets/hooks'
import { editorCollectionAccess } from './shared/access'
import {
  createMetaSyncHook,
  createSeoTabFields,
  createSlugField,
} from './shared/fields'
import { CONTENT_STATUS_OPTIONS, DIFFICULTY_OPTIONS, LIGHTING_OPTIONS } from './shared/options'

const sidebarFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    defaultValue: 'draft',
    required: true,
    options: [...CONTENT_STATUS_OPTIONS],
    admin: {
      position: 'sidebar',
      description: 'Only published guides appear on the storefront.',
    },
  },
  createSlugField('title'),
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Show on homepage care preview section.',
    },
  },
]

export const CareSheets: CollectionConfig = {
  slug: 'care-sheets',
  labels: {
    singular: 'Care Sheet',
    plural: 'Care Sheets',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'genus', 'difficulty', 'status', 'featured', 'updatedAt'],
    description: 'Species-specific orchid culture guides for collectors.',
    listSearchableFields: ['title', 'slug', 'genus', 'alliance', 'summary'],
    pagination: { defaultLimit: 25 },
  },
  access: editorCollectionAccess,
  hooks: {
    beforeValidate: [
      validatePublishedCareSheet,
      createMetaSyncHook({ titleField: 'title', descriptionField: 'summary' }),
    ],
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          description: 'Guide identity and introduction.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  minLength: 2,
                  maxLength: 120,
                  admin: { width: '50%' },
                },
                {
                  name: 'genus',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Primary genus (e.g. Cattleya, Phalaenopsis).',
                  },
                },
              ],
            },
            {
              name: 'alliance',
              type: 'text',
              admin: {
                description: 'Broader alliance grouping (e.g. Cattleya Alliance).',
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: {
                description: 'Plain-text summary for index pages and SEO fallback.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Full cultural guide — watering, repotting, blooming, troubleshooting.',
              },
            },
          ],
        },
        {
          label: 'Culture',
          description: 'Quick-reference growing requirements.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'difficulty',
                  type: 'select',
                  required: true,
                  options: [...DIFFICULTY_OPTIONS],
                  admin: { width: '50%' },
                },
                {
                  name: 'lighting',
                  type: 'select',
                  options: [...LIGHTING_OPTIONS],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'humidity',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'e.g. 60–80%',
                  },
                },
                {
                  name: 'temperature',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'e.g. 65–75°F day / 55–62°F night',
                  },
                },
              ],
            },
            {
              name: 'wateringNotes',
              type: 'textarea',
              admin: { description: 'Seasonal watering rhythm and dry rest periods.' },
            },
            {
              name: 'fertilizerNotes',
              type: 'textarea',
              admin: { description: 'Feeding schedule and formulation guidance.' },
            },
          ],
        },
        {
          label: 'Related',
          description: 'Cross-link products and related guides.',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Orchids in the catalog that match this care guide.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero image for care guide pages.',
              },
            },
          ],
        },
        createSeoTabFields(),
      ],
    },
  ],
}
