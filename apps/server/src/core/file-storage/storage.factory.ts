import { env } from '@servexa-warranty-ai/env/server'
import type { IStorageProvider } from './storage-provider.interface'
import { LocalStorageProvider } from './local-storage.provider'
import { CloudflareR2StorageProvider } from './r2-storage.provider'

export function getStorageProvider(): IStorageProvider {
  if (env.STORAGE_PROVIDER === 'r2' || (env.NODE_ENV === 'production' && env.R2_ACCOUNT_ID)) {
    return new CloudflareR2StorageProvider()
  }
  return new LocalStorageProvider()
}
