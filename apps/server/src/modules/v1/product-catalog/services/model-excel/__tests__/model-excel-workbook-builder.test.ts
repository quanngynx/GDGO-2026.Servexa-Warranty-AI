import { describe, it, expect } from 'vitest'
import { ModelExcelWorkbookBuilder } from '../model-excel-workbook-builder'

describe('ModelExcelWorkbookBuilder', () => {
  const builder = new ModelExcelWorkbookBuilder()

  it('should build export workbook with correct columns and rows', async () => {
    const workbook = await builder.buildExportWorkbook([
      {
        modelCode: 'MOD-001',
        name: 'Model 1',
        categoryId: 'cat-1',
        status: 'active',
        laborCost: 100,
        inspectionCost: 50,
        stockNumber: 10,
        image: 'img.png',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ])
    const sheet = workbook.getWorksheet('Models')
    expect(sheet).toBeDefined()
    expect(sheet?.rowCount).toBe(2)
  })

  it('should build template workbook with sample row', async () => {
    const workbook = await builder.buildTemplateWorkbook()
    const sheet = workbook.getWorksheet('Models_Import_Template')
    expect(sheet).toBeDefined()
    expect(sheet?.rowCount).toBe(2)
  })
})
