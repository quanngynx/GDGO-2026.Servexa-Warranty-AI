import { BaseApi } from '@/libs/axios'
import type {
  DocumentApiResponse,
  RequestListDocumentsDto,
  ResponseDocumentDto,
  ResponseDocumentListDto,
} from './data-transfer-object'

class DocumentAPI extends BaseApi {
  findAll(params?: RequestListDocumentsDto) {
    return this.tryGet<DocumentApiResponse<ResponseDocumentListDto>>('/v1/document/documents', {
      params,
    })
  }

  findOneById(documentId: string) {
    return this.tryGet<DocumentApiResponse<ResponseDocumentDto>>(
      `/v1/document/documents/${documentId}`,
    )
  }

  deleteDocument(documentId: string) {
    return this.tryDelete<DocumentApiResponse<{ success: boolean }>>(
      `/v1/document/documents/${documentId}`,
    )
  }
}

export const documentAPI = new DocumentAPI()
