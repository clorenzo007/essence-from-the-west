import type { CollectionConfig, Field } from 'payload'

import { setPublishedAtOnPublish, validatePublishedBlogPost } from './blog-posts/hooks'
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
      description: 'Only published posts appear on the journal.',
    },
  },
  createSlugField('title'),
  {
    name: 'publishedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
      date: { pickerAppearance: 'dayAndTime' },
      description: 'Required when publishing. Auto-set if left empty.',
    },
  },
  {
    name: 'author',
    type: 'text',
    defaultValue: 'Essence Editorial',
    admin: {
      position: 'sidebar',
    },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Highlight on journal index.',
    },
  },
]

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Journal Post',
    plural: 'Journal Posts',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'publishedAt', 'status', 'featured', 'updatedAt'],
    description: 'SEO blog and botanical editorial for the nursery journal.',
    listSearchableFields: ['title', 'slug', 'excerpt', 'author'],
    pagination: { defaultLimit: 25 },
  },
  access: publishedReadAccess,
  hooks: {
    beforeValidate: [
      setPublishedAtOnPublish,
      validatePublishedBlogPost,
      createMetaSyncHook({ titleField: 'title', descriptionField: 'excerpt' }),
    ],
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Article body and summary.',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              minLength: 2,
              maxLength: 120,
              admin: {
                description: 'Headline shown on journal index and article page.',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: {
                description: 'Plain-text summary for cards and SEO fallback (max 280 chars).',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Full article — culture notes, nursery stories, seasonal advice.',
              },
            },
            {
              name: 'tags',
              type: 'array',
              labels: { singular: 'Tag', plural: 'Tags' },
              admin: {
                description: 'Optional topical tags (e.g. repotting, fragrance, winter care).',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Cover image for journal cards and social sharing.',
              },
            },
          ],
        },
        createSeoTabFields(),
      ],
    },
  ],
}
