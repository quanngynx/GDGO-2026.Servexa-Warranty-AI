import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { documentAPI } from '@/libs/api/document/api'
import { documentQueryKeys } from './query-keys'

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => documentAPI.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.lists() })
      toast.success('Document deleted successfully')
    },
  })
}
