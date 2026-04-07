import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16

/**
 * Encrypts sensitive data before storing in Redis
 * @param text - Plain text to encrypt
 * @returns Encrypted text in format: iv:encryptedData
 */
export function encrypt(text: string): string {
  try {
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypts data retrieved from Redis
 * @param text - Encrypted text in format: iv:encryptedData
 * @returns Decrypted plain text
 */
export function decrypt(text: string): string {
  try {
    const parts = text.split(':')
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format')
    }
    const [ivHex, encryptedData] = parts as [string, string]
    
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

