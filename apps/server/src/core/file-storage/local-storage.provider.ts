import fs from 'fs'
import path from 'path'
import { env } from '@servexa-warranty-ai/env/server'
import type { IStorageProvider, StorageUploadResult } from './storage-provider.interface'
import { resolveUploadSubpath } from './multer'

export class LocalStorageProvider implements IStorageProvider {
  async uploadImage(
    fileBuffer: Buffer,
    _originalName: string,
    subfolder: string = 'accessories',
  ): Promise<StorageUploadResult> {
    const uploadDir = resolveUploadSubpath(subfolder)
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const unique = Math.round(Math.random() * 1e9)
    const filename = `img-${timestamp}-${unique}.webp`
    const filePath = path.join(uploadDir, filename)

    await fs.promises.writeFile(filePath, fileBuffer)

    const cleanSubfolder = subfolder.replace(/^\/+|\/+$/g, '')
    const relativeKey = `/uploads/${cleanSubfolder}/${filename}`

    const baseUrl = `http://localhost:${env.PORT || 3000}`
    const fullUrl = `${baseUrl}${relativeKey}`

    return {
      key: relativeKey,
      url: fullUrl,
    }
  }

  async deleteFile(relativeKey: string): Promise<void> {
    try {
      const cleanPath = relativeKey.replace(/^\/uploads\//, '')
      const fullPath = resolveUploadSubpath(cleanPath)
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath)
      }
    } catch (error: unknown) {
      console.error('Error deleting local file:', error)
    }
  }
}
