import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { processAndOptimizeImage } from '../image-processor'
import { LocalStorageProvider } from '../local-storage.provider'
import { getStorageProvider } from '../storage.factory'

describe('File Storage Module', () => {
  it('should convert an image to webp and optimize it', async () => {
    // Create a 100x100 PNG buffer
    const testPngBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer()

    const webpBuffer = await processAndOptimizeImage(testPngBuffer)
    expect(Buffer.isBuffer(webpBuffer)).toBe(true)

    const metadata = await sharp(webpBuffer).metadata()
    expect(metadata.format).toBe('webp')
    expect(metadata.width).toBe(100)
  })

  it('should store file locally with LocalStorageProvider', async () => {
    const provider = new LocalStorageProvider()
    const testBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 4,
        background: { r: 0, g: 255, b: 0, alpha: 1 },
      },
    })
      .webp()
      .toBuffer()

    const result = await provider.uploadImage(testBuffer, 'test.png', 'accessories/test')
    expect(result.key).toContain('/uploads/accessories/test/')
    expect(result.key).toContain('.webp')
    expect(result.url).toContain(result.key)

    await provider.deleteFile(result.key)
  })

  it('should return LocalStorageProvider by default', () => {
    const provider = getStorageProvider()
    expect(provider).toBeInstanceOf(LocalStorageProvider)
  })
})
