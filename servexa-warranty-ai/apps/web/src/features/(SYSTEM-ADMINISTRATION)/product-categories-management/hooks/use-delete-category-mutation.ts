import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryAPI } from '@/libs/api/product-catalog/category/api'
import { categoryQueryKeys } from './query-keys'

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => categoryAPI.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() })
      toast.success('Category deleted successfully')
    },
  })
}
