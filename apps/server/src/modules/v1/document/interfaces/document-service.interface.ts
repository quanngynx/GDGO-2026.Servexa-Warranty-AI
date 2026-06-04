import type {
  CreateDocumentDto,
  FindAllDocumentsInput,
  ReplaceDocumentDto,
  UpdateDocumentDto,
} from "../dtos/document.dto";
import type {
  DocumentFileVersionRecord,
  DocumentRecord,
} from "../document.types";
import type { BasePagination } from "@/types/pagination";

export interface FileUploadMeta {
  filePath: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
}

export interface IDocumentService {
  findAll(
    query: FindAllDocumentsInput,
  ): Promise<{
    items: DocumentRecord[] | null;
    pagination: BasePagination;
  }>;
  findOneById(
    documentId: string,
  ): Promise<DocumentRecord | null>;
  create(
    input: CreateDocumentDto,
    createdById: string,
    file?: FileUploadMeta,
  ): Promise<DocumentRecord | null>;
  replace(
    documentId: string,
    input: ReplaceDocumentDto,
    updatedById: string,
    file?: FileUploadMeta,
  ): Promise<DocumentRecord | null>;
  update(
    documentId: string,
    input: UpdateDocumentDto,
    updatedById: string,
  ): Promise<DocumentRecord | null>;
  delete(documentId: string, updatedById: string): Promise<{ success: true }>;
  findVersions(
    documentId: string,
  ): Promise<DocumentFileVersionRecord[] | null>;
}
