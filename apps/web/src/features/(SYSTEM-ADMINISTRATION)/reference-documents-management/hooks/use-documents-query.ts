import { useQuery } from '@tanstack/react-query'
import { documentAPI } from '@/libs/api/document/api'
import type { RequestListDocumentsDto } from '@/libs/api/document/data-transfer-object'
import { documentQueryKeys } from './query-keys'

export const useDocumentsQuery = (params?: RequestListDocumentsDto) =>
  useQuery({
    queryKey: documentQueryKeys.list(params),
    queryFn: () => documentAPI.findAll(params),
  })
