import sharp from 'sharp'

export interface ImageProcessorOptions {
  quality?: number
  maxWidth?: number
}

export async function processAndOptimizeImage(
  inputBuffer: Buffer,
  options: ImageProcessorOptions = {},
): Promise<Buffer> {
  const { quality = 80, maxWidth = 1920 } = options

  let pipeline = sharp(inputBuffer)
  const metadata = await pipeline.metadata()

  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  return pipeline
    .webp({ quality, effort: 4 })
    .toBuffer()
}
