/**
 * Unit Test: Section 7 — Cache Testing
 *
 * Tests PermissionCacheService in isolation with a mocked IoredisService.
 * Covers: cache hit, cache miss, set, delete, deleteAll.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { PermissionCacheService } from '../services/permission-cache.service'

// ─── Mock IoredisService ──────────────────────────────────────────────────────
// We mock at module level so the constructor inside PermissionCacheService uses the mock.

const mockConnect = vi.fn().mockResolvedValue(undefined)
const mockGet = vi.fn()
const mockSet = vi.fn().mockResolvedValue(undefined)
const mockDelete = vi.fn().mockResolvedValue(1)
const mockFindAllByPattern = vi.fn()

vi.mock('@/core/infra/ioredis/ioredis-service', () => ({
  IoredisService: vi.fn().mockImplementation(() => ({
    connect: mockConnect,
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
    findAllByPattern: mockFindAllByPattern,
  })),
}))

const USER_ID = 'user-cache-test'
const PERMISSIONS = ['users.read', 'users.write', 'invoice.approve']

describe('PermissionCacheService', () => {
  let cacheService: PermissionCacheService

  beforeEach(() => {
    vi.clearAllMocks()
    cacheService = new PermissionCacheService()
  })

  describe('get()', () => {
    it('returns null on cache miss', async () => {
      mockGet.mockResolvedValue(null)

      const result = await cacheService.get(USER_ID)

      expect(result).toBeNull()
      expect(mockConnect).toHaveBeenCalledOnce()
      expect(mockGet).toHaveBeenCalledWith(`userPermissions:${USER_ID}`)
    })

    it('returns parsed permissions on cache hit', async () => {
      mockGet.mockResolvedValue(JSON.stringify(PERMISSIONS))

      const result = await cacheService.get(USER_ID)

      expect(result).toEqual(PERMISSIONS)
    })

    it('connects to Redis before querying', async () => {
      mockGet.mockResolvedValue(null)

      await cacheService.get(USER_ID)

      // `!` is unavoidable: TypeScript can't narrow number|undefined from expect() assertions,
      // but both mocks are guaranteed called at this point (asserted implicitly by the test setup).
      const connectOrder = (mockConnect as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]!
      const getOrder = (mockGet as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]!
      expect(connectOrder).toBeLessThan(getOrder)
    })
  })

  describe('set()', () => {
    it('writes serialized permissions with TTL', async () => {
      await cacheService.set(USER_ID, PERMISSIONS)

      expect(mockSet).toHaveBeenCalledWith(
        `userPermissions:${USER_ID}`,
        JSON.stringify(PERMISSIONS),
        cacheService.TTL_SECONDS,
      )
    })

    it('stores empty array correctly', async () => {
      await cacheService.set(USER_ID, [])

      expect(mockSet).toHaveBeenCalledWith(
        `userPermissions:${USER_ID}`,
        JSON.stringify([]),
        cacheService.TTL_SECONDS,
      )
    })
  })

  describe('delete()', () => {
    it('deletes the cache key for the user', async () => {
      await cacheService.delete(USER_ID)

      expect(mockDelete).toHaveBeenCalledWith(`userPermissions:${USER_ID}`)
    })
  })

  describe('deleteAll()', () => {
    it('deletes all matching permission keys', async () => {
      const matchedKeys = [
        'userPermissions:user-1',
        'userPermissions:user-2',
        'userPermissions:user-3',
      ]
      mockFindAllByPattern.mockResolvedValue(matchedKeys)

      await cacheService.deleteAll()

      expect(mockFindAllByPattern).toHaveBeenCalledWith('userPermissions:*')
      expect(mockDelete).toHaveBeenCalledWith(...matchedKeys)
    })

    it('does not call delete when no keys found', async () => {
      mockFindAllByPattern.mockResolvedValue([])

      await cacheService.deleteAll()

      expect(mockDelete).not.toHaveBeenCalled()
    })

    it('does not call delete when findAllByPattern returns null', async () => {
      mockFindAllByPattern.mockResolvedValue(null)

      await cacheService.deleteAll()

      expect(mockDelete).not.toHaveBeenCalled()
    })
  })

  describe('Cache invalidation events', () => {
    it('cache key pattern: userPermissions:<userId>', async () => {
      await cacheService.delete('specific-user')
      expect(mockDelete).toHaveBeenCalledWith('userPermissions:specific-user')
    })
  })
})
