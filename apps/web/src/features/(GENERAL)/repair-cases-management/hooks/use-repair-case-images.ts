import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import type { RepairCaseImageType } from '@/libs/api/asc-center/repair-case/data-transfer-object'

export const useRepairCaseImagesQuery = (repairCaseId: string | undefined) =>
  useQuery({
    queryKey: ['repair-case-images', repairCaseId],
    queryFn: () => repairCaseAPI.listImages(repairCaseId as string),
    enabled: !!repairCaseId,
  })

type UploadRepairCaseImagesPayload = {
  repairCaseId: string
  images: File[]
  imageType: RepairCaseImageType
  description?: string
}

export const useUploadRepairCaseImagesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UploadRepairCaseImagesPayload) =>
      repairCaseAPI.uploadImages(
        payload.repairCaseId,
        payload.images,
        payload.imageType,
        payload.description
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['repair-case-images', variables.repairCaseId] })
      toast.success('Images uploaded successfully')
    },
  })
}

type DeleteRepairCaseImagePayload = {
  repairCaseId: string
  imageId: string
}

export const useDeleteRepairCaseImageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteRepairCaseImagePayload) =>
      repairCaseAPI.deleteImage(payload.repairCaseId, payload.imageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['repair-case-images', variables.repairCaseId] })
      toast.success('Image deleted successfully')
    },
  })
}
