import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import type { RequestCreateRepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { repairCaseQueryKeys } from './query-keys'

export const useCreateRepairCaseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateRepairCaseDto) => repairCaseAPI.createRepairCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairCaseQueryKeys.lists() })
      toast.success('Repair case created successfully')
    },
  })
}
