import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.URL.revokeObjectURL(url)
}

export const useExportRepairCases = () =>
  useMutation({
    mutationFn: () => repairCaseAPI.exportExcel(),
    onSuccess: (file) => {
      if (!file) {
        toast.error('Failed to export repair cases')
        return
      }
      downloadBlob(file, `repair-cases-${Date.now()}.xlsx`)
      toast.success('Export completed')
    },
    onError: () => {
      toast.error('Failed to export repair cases')
    },
  })
