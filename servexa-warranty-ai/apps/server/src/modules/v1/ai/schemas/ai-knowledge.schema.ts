import z from "zod";

export const aiKnowledgeIngestTextBodySchema = z.object({
  tenantId: z.string().trim().min(1),
  documentScope: z.string().trim().min(1),
  title: z.string().trim().min(1),
  text: z.string().min(1),
});

export type AiKnowledgeIngestTextBody = z.infer<typeof aiKnowledgeIngestTextBodySchema>;

export const aiKnowledgeSearchQuerySchema = z.object({
  tenantId: z.string().trim().min(1),
  q: z.string().trim().min(1),
  documentScope: z.string().trim().optional(),
  topK: z.coerce.number().int().positive().max(20).optional(),
});

export type AiKnowledgeSearchQuery = z.infer<typeof aiKnowledgeSearchQuerySchema>;

export const aiKnowledgeIngestDocumentBodySchema = z.object({
  tenantId: z.string().trim().min(1),
  documentScope: z.string().trim().min(1),
  title: z.string().trim().min(1),
  mimeType: z.enum(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]),
  base64Content: z.string().min(1),
});

export const aiKnowledgeReindexBodySchema = z.object({
  tenantId: z.string().trim().min(1),
  documentId: z.string().trim().min(1),
});

export type AiKnowledgeIngestDocumentBody = z.infer<typeof aiKnowledgeIngestDocumentBodySchema>;
export type AiKnowledgeReindexBody = z.infer<typeof aiKnowledgeReindexBodySchema>;
