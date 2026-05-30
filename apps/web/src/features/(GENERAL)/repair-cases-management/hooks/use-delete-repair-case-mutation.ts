import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import { repairCaseQueryKeys } from './query-keys'

export const useDeleteRepairCaseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (repairCaseId: string) => repairCaseAPI.deleteRepairCase(repairCaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairCaseQueryKeys.lists() })
      toast.success('Repair case deleted successfully')
    },
  })
}
