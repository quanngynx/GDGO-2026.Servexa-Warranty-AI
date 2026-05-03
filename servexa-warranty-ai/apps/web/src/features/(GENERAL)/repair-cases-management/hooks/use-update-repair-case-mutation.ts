import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import type { RequestUpdateRepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { repairCaseQueryKeys } from './query-keys'

type UpdateRepairCasePayload = {
  repairCaseId: string
  data: RequestUpdateRepairCaseDto
}

export const useUpdateRepairCaseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ repairCaseId, data }: UpdateRepairCasePayload) =>
      repairCaseAPI.updateRepairCase(repairCaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairCaseQueryKeys.lists() })
      toast.success('Repair case updated successfully')
    },
  })
}
