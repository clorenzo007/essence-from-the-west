/**
 * Upload existing local media + public site images to Cloudinary and update Payload records.
 *
 * Usage: npm run migrate:cloudinary
 * Requires: DATABASE_URI, PAYLOAD_SECRET, CLOUDINARY_* in .env
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import { getPayload } from 'payload'

import config from '@payload-config'

import { getCloudinaryConfig, isCloudinaryEnabled } from '../src/lib/cloudinary'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

async function uploadFile(filePath: string, subfolder: string) {
  const { folder, cloudName, apiKey, apiSecret } = getCloudinaryConfig()

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `${folder}/${subfolder}`,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
  })

  return result
}

async function migratePayloadMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  const mediaDir = path.join(projectRoot, 'media')
  if (!fs.existsSync(mediaDir)) {
    console.log('No local media/ folder — skipping Payload media migration.')
    return
  }

  const { docs } = await payload.find({
    collection: 'media',
    limit: 500,
    pagination: false,
  })

  console.log(`Found ${docs.length} media records in Payload.`)

  for (const doc of docs) {
    const filename = doc.filename
    if (!filename) continue

    const localPath = path.join(mediaDir, filename)
    if (!fs.existsSync(localPath)) {
      console.warn(`  Skip (file missing): ${filename}`)
      continue
    }

    if (doc.url?.includes('cloudinary.com')) {
      console.log(`  Already on Cloudinary: ${filename}`)
      continue
    }

    const result = await uploadFile(localPath, 'media')
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        url: result.secure_url,
        cloudinaryPublicId: result.public_id,
        width: result.width,
        height: result.height,
        filesize: result.bytes,
      },
    })
    console.log(`  Uploaded: ${filename} → ${result.secure_url}`)
  }
}

async function migratePublicAssets() {
  const publicImages = path.join(projectRoot, 'public', 'images')
  if (!fs.existsSync(publicImages)) return

  const manifestPath = path.join(projectRoot, 'public', 'cloudinary-manifest.json')
  const manifest: Record<string, string> = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : {}

  const files = fs.readdirSync(publicImages).filter((f) => /\.(svg|jpg|jpeg|png|webp)$/i.test(f))

  for (const file of files) {
    const key = `images/${file}`
    if (manifest[key]) {
      console.log(`  Static asset already migrated: ${key}`)
      continue
    }

    const result = await uploadFile(path.join(publicImages, file), 'site')
    manifest[key] = result.secure_url
    console.log(`  Site asset: ${key} → ${result.secure_url}`)
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log('Wrote public/cloudinary-manifest.json')
}

async function main() {
  if (!isCloudinaryEnabled()) {
    console.error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  await migratePayloadMedia(payload)
  await migratePublicAssets()
  console.log('Migration complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
