import { describe, it, expect } from 'vitest'
import { ModelExcelImportParser } from '../model-excel-import-parser'

describe('ModelExcelImportParser', () => {
  const parser = new ModelExcelImportParser()

  it('should detect duplicate modelCode in reference set', () => {
    const parsedRows = [
      {
        row: 2,
        data: {
          modelCode: 'MOD-DUP',
          name: 'Model DUP',
          categoryId: '019f8dfa-533b-7285-817d-31ca23d08307',
        },
      },
    ]
    const refs = {
      existingCodeSet: new Set(['MOD-DUP']),
      validCategorySet: new Set(['019f8dfa-533b-7285-817d-31ca23d08307']),
    }
    const result = parser.buildCreateInputs(parsedRows, refs)
    expect(result.rowsToCreate.length).toBe(0)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]?.message).toContain('Duplicate modelCode: MOD-DUP')
  })

  it('should detect invalid categoryId', () => {
    const parsedRows = [
      {
        row: 2,
        data: {
          modelCode: 'MOD-NEW',
          name: 'Model New',
          categoryId: '019f8dfa-0000-7285-817d-31ca23d00000',
        },
      },
    ]
    const refs = {
      existingCodeSet: new Set<string>(),
      validCategorySet: new Set<string>(),
    }
    const result = parser.buildCreateInputs(parsedRows, refs)
    expect(result.rowsToCreate.length).toBe(0)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]?.message).toBe('Category not found')
  })

  it('should construct valid ModelCreateManyInput for valid rows', () => {
    const parsedRows = [
      {
        row: 2,
        data: {
          modelCode: 'MOD-OK',
          name: 'Model OK',
          categoryId: '019f8dfa-533b-7285-817d-31ca23d08307',
          status: 'active' as const,
          laborCost: 100000,
          inspectionCost: 20000,
          stockNumber: 5,
        },
      },
    ]
    const refs = {
      existingCodeSet: new Set<string>(),
      validCategorySet: new Set(['019f8dfa-533b-7285-817d-31ca23d08307']),
    }
    const result = parser.buildCreateInputs(parsedRows, refs)
    expect(result.rowsToCreate.length).toBe(1)
    expect(result.rowsToCreate[0]?.modelCode).toBe('MOD-OK')
  })
})
