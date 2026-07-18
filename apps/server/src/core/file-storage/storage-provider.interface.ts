export interface StorageUploadResult {
  key: string
  url: string
}

export interface IStorageProvider {
  uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    subfolder?: string,
  ): Promise<StorageUploadResult>
  deleteFile(key: string): Promise<void>
}
