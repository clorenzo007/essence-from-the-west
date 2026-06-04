import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { getTrustedOrigins } from './lib/auth-cookies'
import { getCloudinaryConfig, isCloudinaryEnabled } from './lib/cloudinary'
import { getServerURL } from './lib/env'
import { cloudinaryAdapter } from './storage/cloudinaryAdapter'

import { BlogPosts } from './collections/BlogPosts'
import { CareSheets } from './collections/CareSheets'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useCloudinary = isCloudinaryEnabled()
const useVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !useCloudinary

const storagePlugins = useCloudinary
  ? [
      cloudStoragePlugin({
        collections: {
          media: {
            adapter: cloudinaryAdapter,
            disableLocalStorage: true,
            disablePayloadAccessControl: true,
            prefix: getCloudinaryConfig().folder,
          },
        },
      }),
    ]
  : useVercelBlob
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN || '',
        }),
      ]
    : []

export default buildConfig({
  serverURL: getServerURL(),
  csrf: getTrustedOrigins(),
  cors: getTrustedOrigins(),
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Reserva Oeste',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, BlogPosts, CareSheets, Customers],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: storagePlugins,
  sharp,
})
