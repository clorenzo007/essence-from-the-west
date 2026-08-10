import type { CollectionConfig, Field } from 'payload'

import { isLoggedIn } from './shared/access'
import {
  CARE_LOG_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  DIFFICULTY_OPTIONS,
  LIFECYCLE_STATUS_OPTIONS,
  LIGHTING_OPTIONS,
  MOUNTING_OPTIONS,
} from './specimens/options'

const sidebarFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 120,
    admin: {
      position: 'sidebar',
      description: 'Internal identifier or nickname (e.g. "Cattleya walkeriana #3"). Never shown publicly.',
    },
  },
  {
    name: 'lifecycleStatus',
    type: 'select',
    defaultValue: 'active',
    required: true,
    options: [...LIFECYCLE_STATUS_OPTIONS],
    admin: {
      position: 'sidebar',
      description: 'Track whether this specimen is still in your personal collection.',
    },
  },
  {
    name: 'relatedProduct',
    type: 'relationship',
    relationTo: 'products',
    admin: {
      position: 'sidebar',
      description: 'Optional — link this specimen to its listing in Orchids if it is also for sale.',
    },
  },
  {
    name: 'currentlyBlooming',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Quick flag for the collection view.',
    },
  },
  {
    name: 'currentFlowerCount',
    type: 'number',
    min: 0,
    admin: {
      position: 'sidebar',
      description: 'Open flowers right now.',
    },
  },
]

export const Specimens: CollectionConfig = {
  slug: 'specimens',
  labels: {
    singular: 'Specimen',
    plural: 'Specimens',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Cultivation',
    defaultColumns: [
      'name',
      'genus',
      'species',
      'lifecycleStatus',
      'currentlyBlooming',
      'relatedProduct',
      'updatedAt',
    ],
    description:
      'Personal grow log — one record per individual plant: provenance, taxonomy, bloom history, and care log. Internal only, never shown on the public site.',
    listSearchableFields: ['name', 'genus', 'species', 'subspecies', 'hybridOrClone', 'source'],
    pagination: { defaultLimit: 25 },
  },
  // Private collection: only logged-in admin/editor users can see or touch this data.
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          description: 'Taxonomy and identification.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'genus',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. Cattleya, Phalaenopsis.' },
                },
                {
                  name: 'species',
                  type: 'text',
                  admin: { width: '50%', description: 'Species epithet.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'subspecies',
                  type: 'text',
                  admin: { width: '50%', description: 'Subspecies or botanical variety, if known.' },
                },
                {
                  name: 'hybridOrClone',
                  type: 'text',
                  admin: { width: '50%', description: 'Grex, cross, or clone name, if applicable.' },
                },
              ],
            },
            {
              name: 'commonName',
              type: 'text',
              admin: { description: 'Everyday name or nickname, if different from the identifier above.' },
            },
            {
              name: 'origin',
              type: 'text',
              admin: { description: 'Geographic origin or breeding lineage note (optional).' },
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: { description: 'Freeform notes about this individual plant.' },
            },
          ],
        },
        {
          label: 'Acquisition',
          description: 'Where and when you got this plant.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'purchaseDate',
                  type: 'date',
                  admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                },
                {
                  name: 'source',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Where you got it — nursery, fair, grower, gift, trade, etc.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pricePaid',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'USD',
                  options: [...CURRENCY_OPTIONS],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'acquisitionNotes',
              type: 'textarea',
              admin: { description: 'Condition on arrival, size at purchase, seller notes, etc.' },
            },
          ],
        },
        {
          label: 'Growing Conditions',
          description: 'Where and how this specimen is kept.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'lighting',
                  type: 'select',
                  options: [...LIGHTING_OPTIONS],
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
                  name: 'humidity',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. 60–80%' },
                },
                {
                  name: 'temperature',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. 65–75°F day / 55–62°F night' },
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              admin: { description: 'Physical location — e.g. "Greenhouse A, shelf 3".' },
            },
            {
              name: 'difficulty',
              type: 'select',
              options: [...DIFFICULTY_OPTIONS],
            },
          ],
        },
        {
          label: 'Bloom History',
          description: 'Log every bloom cycle for this plant over time.',
          fields: [
            {
              name: 'bloomEvents',
              type: 'array',
              labels: { singular: 'Bloom Event', plural: 'Bloom Events' },
              admin: {
                initCollapsed: true,
                description: 'One entry per flowering — add a new one each time this plant blooms again.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'bloomStartDate',
                      type: 'date',
                      required: true,
                      admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                    },
                    {
                      name: 'bloomEndDate',
                      type: 'date',
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayOnly' },
                        description: 'Leave empty while still in bloom.',
                      },
                    },
                  ],
                },
                {
                  name: 'flowerCount',
                  type: 'number',
                  min: 0,
                  admin: { description: 'Number of open flowers during this bloom.' },
                },
                {
                  name: 'notes',
                  type: 'textarea',
                  admin: { description: 'Color, size, fragrance, spike count, anything worth remembering.' },
                },
                {
                  name: 'photos',
                  type: 'array',
                  labels: { singular: 'Photo', plural: 'Photos' },
                  admin: { description: 'Flower photos for this bloom.' },
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media', required: true },
                    { name: 'caption', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Care Log',
          description: 'Watering, fertilizing, pest control, repotting — a running diary.',
          fields: [
            {
              name: 'careLog',
              type: 'array',
              labels: { singular: 'Log Entry', plural: 'Log Entries' },
              admin: {
                initCollapsed: true,
                description: 'Add an entry every time you fertilize, spray, repot, or otherwise tend to this plant.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [...CARE_LOG_TYPE_OPTIONS],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'product',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Fertilizer, fungicide, insecticide, or substrate used.',
                      },
                    },
                    {
                      name: 'dose',
                      type: 'text',
                      admin: { width: '50%', description: 'Dose / dilution (e.g. "1/4 tsp per liter").' },
                    },
                  ],
                },
                {
                  name: 'notes',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Gallery',
          description: 'Whole-plant photos over time (not tied to a specific bloom).',
          fields: [
            {
              name: 'mainPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Cover photo for this specimen in the admin list.' },
            },
            {
              name: 'photos',
              type: 'array',
              labels: { singular: 'Photo', plural: 'Photos' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                {
                  name: 'date',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
