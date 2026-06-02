import type { CollectionConfig, Field } from 'payload'

import {
  autoGenerateSlug,
  syncMetaFromProduct,
  validatePublishedProduct,
  validateSlugFormat,
} from './products/hooks'
import {
  CURRENCY_OPTIONS,
  DIFFICULTY_OPTIONS,
  FLOWERING_SEASON_OPTIONS,
  FRAGRANCE_OPTIONS,
  LIGHTING_OPTIONS,
  MOUNTING_OPTIONS,
  PLANT_SIZE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
} from './products/options'

const sidebarFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    defaultValue: 'draft',
    required: true,
    options: [...PRODUCT_STATUS_OPTIONS],
    admin: {
      position: 'sidebar',
      description: 'Only published products appear on the storefront.',
    },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Show on homepage featured collection.',
    },
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Auto-generated from name on create. Edit only if needed.',
    },
    hooks: {
      beforeValidate: [autoGenerateSlug, validateSlugFormat],
    },
  },
  {
    name: 'sku',
    type: 'text',
    unique: true,
    admin: {
      position: 'sidebar',
      description: 'Internal inventory code (optional).',
    },
  },
]

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Orchid',
    plural: 'Orchids',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'species', 'price', 'stock', 'status', 'featured', 'updatedAt'],
    description: 'Premium orchid inventory — culture, commerce, and SEO.',
    listSearchableFields: ['name', 'species', 'hybrid', 'genus', 'sku', 'slug'],
    pagination: {
      defaultLimit: 25,
    },
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  hooks: {
    beforeValidate: [validatePublishedProduct, syncMetaFromProduct],
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          description: 'Identity, taxonomy, and customer-facing copy.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  minLength: 2,
                  maxLength: 120,
                  admin: {
                    width: '50%',
                    description: 'Display name shown on product pages and catalog.',
                  },
                },
                {
                  name: 'genus',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Primary genus (e.g. Phalaenopsis, Cattleya).',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'species',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Species epithet or primary label for catalog cards.',
                  },
                },
                {
                  name: 'hybrid',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Grex, clone, or hybrid designation.',
                  },
                },
              ],
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              required: true,
              admin: {
                description: 'Assign at least one category for catalog filtering.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: {
                description: 'Plain-text summary for catalog cards and SEO fallback (max 280 chars).',
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              admin: {
                description: 'Full product story, bloom notes, and collector details.',
              },
            },
            {
              name: 'origin',
              type: 'text',
              admin: {
                description: 'Geographic origin or breeding lineage note.',
              },
            },
            {
              name: 'awards',
              type: 'text',
              admin: {
                description: 'AOS, FCC, or other awards (optional).',
              },
            },
          ],
        },
        {
          label: 'Commerce',
          description: 'Pricing, inventory, and availability.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: {
                    width: '33%',
                    step: 1,
                    description: 'Current sale price.',
                  },
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  min: 0,
                  admin: {
                    width: '33%',
                    step: 1,
                    description: 'Optional original price for promotions.',
                  },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'USD',
                  options: [...CURRENCY_OPTIONS],
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'stock',
                  type: 'number',
                  required: true,
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Units available to sell.',
                  },
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  defaultValue: 2,
                  min: 0,
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Highlight low inventory in admin when at or below this level.',
                  },
                },
              ],
            },
            {
              name: 'availabilityNote',
              type: 'text',
              admin: {
                description: 'Optional note (e.g. "Ships in 3–5 days").',
              },
            },
          ],
        },
        {
          label: 'Culture',
          description: 'Growing requirements for serious collectors.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'plantSize',
                  type: 'select',
                  options: [...PLANT_SIZE_OPTIONS],
                  admin: { width: '50%' },
                },
                {
                  name: 'mounting',
                  type: 'select',
                  options: [...MOUNTING_OPTIONS],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'floweringSeason',
                  type: 'select',
                  hasMany: true,
                  options: [...FLOWERING_SEASON_OPTIONS],
                  admin: {
                    width: '50%',
                    description: 'Select all seasons when this plant typically blooms.',
                  },
                },
                {
                  name: 'bloomSize',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'e.g. 3" flowers',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fragrance',
                  type: 'select',
                  options: [...FRAGRANCE_OPTIONS],
                  admin: { width: '50%' },
                },
                {
                  name: 'difficulty',
                  type: 'select',
                  required: true,
                  options: [...DIFFICULTY_OPTIONS],
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
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'e.g. 60–80%',
                  },
                },
                {
                  name: 'temperature',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'e.g. 65–75°F day / 55–62°F night',
                  },
                },
              ],
            },
            {
              name: 'lighting',
              type: 'select',
              required: true,
              options: [...LIGHTING_OPTIONS],
            },
            {
              name: 'wateringNotes',
              type: 'textarea',
              admin: {
                description: 'Seasonal watering rhythm and dry rest periods.',
              },
            },
            {
              name: 'fertilizerNotes',
              type: 'textarea',
              admin: {
                description: 'Feeding schedule and formulation guidance.',
              },
            },
            {
              name: 'careSheet',
              type: 'relationship',
              relationTo: 'care-sheets',
              admin: {
                description: 'Link a detailed care guide for this orchid.',
              },
            },
          ],
        },
        {
          label: 'Media',
          description: 'Product photography for catalog and product pages.',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              labels: {
                singular: 'Image',
                plural: 'Gallery Images',
              },
              admin: {
                initCollapsed: false,
                description: 'First image is the default hero unless marked primary below.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: {
                    description: 'Optional caption for accessibility and product detail.',
                  },
                },
                {
                  name: 'isPrimary',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Use as hero image on catalog and product page.',
                  },
                },
              ],
            },
          ],
        },
        {
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
                  admin: {
                    description: 'Page title (defaults to product name). Max 60 chars.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description (defaults to short description). Max 160 chars.',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'Comma-separated keywords (e.g. phalaenopsis, fragrant, species).',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Social share image. Falls back to primary gallery image.',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this product.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
