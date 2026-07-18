import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@servexa-warranty-ai/env/server'
import type { IStorageProvider, StorageUploadResult } from './storage-provider.interface'

export class CloudflareR2StorageProvider implements IStorageProvider {
  private readonly client: S3Client
  private readonly bucketName: string
  private readonly publicDomain: string

  constructor() {
    const accountId = env.R2_ACCOUNT_ID || ''
    const accessKeyId = env.R2_ACCESS_KEY_ID || ''
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY || ''
    this.bucketName = env.R2_BUCKET_NAME || 'servexa-warranty-ai'
    this.publicDomain = env.R2_PUBLIC_DOMAIN || `https://${this.bucketName}.${accountId}.r2.dev`

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async uploadImage(
    fileBuffer: Buffer,
    _originalName: string,
    subfolder: string = 'accessories',
  ): Promise<StorageUploadResult> {
    const cleanSubfolder = subfolder.replace(/^\/+|\/+$/g, '')
    const timestamp = Date.now()
    const unique = Math.round(Math.random() * 1e9)
    const filename = `img-${timestamp}-${unique}.webp`
    const key = `${cleanSubfolder}/${filename}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: 'image/webp',
      }),
    )

    const cleanDomain = this.publicDomain.replace(/\/+$/, '')
    const fullUrl = `${cleanDomain}/${key}`

    return {
      key,
      url: fullUrl,
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )
    } catch (error: unknown) {
      console.error('Error deleting file from Cloudflare R2:', error)
    }
  }
}
