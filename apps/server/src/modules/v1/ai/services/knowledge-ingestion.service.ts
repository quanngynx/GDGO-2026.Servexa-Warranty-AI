import prisma from "@/core/infra/prisma";

import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { Prisma } from "@/core/infra/prisma/generated/client";
import { sha256Hex } from "src/utils/encryption";
// import { type Buffer } from "exceljs"

const EMBEDDING_VERSION = "v1";
const MAX_CHUNK_CHARS = 1200;
const EMBEDDING_RETRY_MAX = 3;

/** Paragraph-aware fixed-width chunking for plain-text MVP. */
export function chunkPlainText(source: string, maxChars: number): string[] {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const chunks: string[] = [];
  let buf = "";
  for (const para of normalized.split(/\n\n+/)) {
    const next = buf ? `${buf}\n\n${para}` : para;
    if (next.length > maxChars) {
      if (buf.trim()) chunks.push(buf.trim());
      let rest = para;
      while (rest.length > maxChars) {
        chunks.push(rest.slice(0, maxChars).trim());
        rest = rest.slice(maxChars);
      }
      buf = rest;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}

/** Recursive splitter with sentence and line-break boundaries preferred. */
export function chunkRecursive(
  source: string,
  maxChars: number,
  separators: string[] = ["\n\n", "\n", ". ", " ", ""],
): string[] {
  const chunks: string[] = [];
  // Default is to split by each character ""
  let currentSeparator = separators[separators.length - 1] ?? "";

  // Find the best separator to split the text
  for (const sep of separators) {
    if (sep === "" || source.includes(sep)) {
      currentSeparator = sep;
      break;
    }
  }

  // Split the text
  const splits = source.split(currentSeparator);
  let buf = "";

  for (const split of splits) {
    const candidate = buf ? buf + currentSeparator + split : split;

    if (candidate.length <= maxChars) {
      buf = candidate;
    } else {
      if (buf) {
        chunks.push(buf.trim());
        buf = "";
      }
      
      // If the current element is larger than maxChars,
      // call the recursive function with the lower separator
      if (split.length > maxChars) {
        // Get the index of the current separator and try the next separator
        const nextSepIndex = separators.indexOf(currentSeparator) + 1;
        const nextSeparators = separators.slice(nextSepIndex);
        
        const recursiveChunks = chunkRecursive(split, maxChars, nextSeparators);
        chunks.push(...recursiveChunks);
      } else {
        buf = split;
      }
    }
  }

  if (buf.trim()) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}

export type IngestPlainTextInput = {
  tenantId: string;
  documentScope: string;
  title: string;
  text: string;
};

export type IngestPlainTextResult = {
  documentId: string;
  chunkCount: number;
};

export class KnowledgeIngestionService {
  private async toTextFromDocument(
    mimeType: string,
    buffer: Buffer,
  ): Promise<string> {
    if (mimeType === "text/plain") {
      // return buffer.toString("utf8");
      return buffer.toString();
    }
    if (mimeType === "application/pdf") {
      const { PDFParse } = await import("pdf-parse");
      const text = await new PDFParse({ data: buffer }).getText();
      return text.text ?? "";
    }
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer });
      return out.value ?? "";
    }
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      // TODO: Fix conflict Buffer/Buffer<ArrayBufferLike>
      await workbook.xlsx.load(buffer as any);
      const parts: string[] = [];
      workbook.eachSheet((sheet) => {
        sheet.eachRow((row) => {
          const cells: string[] = [];
          row.eachCell({ includeEmpty: true }, (cell) => {
            cells.push(cell.value == null ? "" : String(cell.value));
          });
          if (cells.length) parts.push(cells.join("\t"));
        });
      });
      return parts.join("\n").trim();
    }
    if (mimeType === "text/html") {
      const raw = buffer.toString("utf8");
      const noScripts = raw
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ");
      return noScripts.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
    throw new Error(`Unsupported mimeType: ${mimeType}`);
  }

  private async computeEmbedding(text: string): Promise<number[]> {
    let error: unknown = undefined;
    for (let i = 0; i < EMBEDDING_RETRY_MAX; i++) {
      try {
        const { embedding } = await embed({
          model: google.embeddingModel("text-embedding-004"),
          value: text,
        });
        return embedding;
      } catch (e) {
        error = e;
      }
    }
    throw error ?? new Error("Failed to embed chunk");
  }

  async ingestDocument(input: {
    tenantId: string;
    documentScope: string;
    title: string;
    mimeType: string;
    base64Content: string;
  }): Promise<IngestPlainTextResult> {
    const buffer = Buffer.from(input.base64Content, "base64");
    const text = await this.toTextFromDocument(input.mimeType, buffer);
    return this.ingestPlainText({
      tenantId: input.tenantId,
      documentScope: input.documentScope,
      title: input.title,
      text,
    });
  }

  async reindexDocument(input: {
    tenantId: string;
    documentId: string;
  }): Promise<{ chunkCount: number }> {
    const chunks = await prisma.aiKnowledgeChunk.findMany({
      where: {
        documentId: input.documentId,
        tenantId: input.tenantId,
      },
      orderBy: { chunkIndex: "asc" },
    });
    for (const chunk of chunks) {
      const vec = await this.computeEmbedding(chunk.text);
      const literal = `[${vec.join(",")}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "ai_knowledge_chunks" SET "embedding" = $1::vector, "embedding_version" = $2 WHERE "id" = $3`,
        literal,
        EMBEDDING_VERSION,
        chunk.id,
      );
    }
    return { chunkCount: chunks.length };
  }

  async ingestPlainText(
    input: IngestPlainTextInput,
  ): Promise<IngestPlainTextResult> {
    const normalized = input.text.replace(/\r\n/g, "\n").trim();
    const contentHash = sha256Hex(normalized);
    const chunks = chunkRecursive(normalized, MAX_CHUNK_CHARS);
    if (chunks.length === 0) {
      throw new Error("No ingestable text after normalization");
    }

    const existing = await prisma.aiKnowledgeDocument.findFirst({
      where: {
        tenantId: input.tenantId,
        documentScope: input.documentScope,
        contentHash,
        status: "ready",
      },
      select: { id: true, chunks: { select: { id: true } } },
    });
    if (existing) {
      return { documentId: existing.id, chunkCount: existing.chunks.length };
    }

    const doc = await prisma.aiKnowledgeDocument.create({
      data: {
        tenantId: input.tenantId,
        documentScope: input.documentScope,
        title: input.title,
        contentHash,
        documentVersion: 1,
        status: "processing",
        mimeType: "text/plain",
        metadata: { source: "ingest-text-mvp" } as Prisma.InputJsonValue,
      },
    });

    try {
      for (let i = 0; i < chunks.length; i++) {
        const text = chunks[i]!;
        const chunkHash = sha256Hex(`${text}:${EMBEDDING_VERSION}`);
        const embedding = await this.computeEmbedding(text);
        const vec = embedding;
        if (vec.length !== 768) {
          throw new Error(
            `Unexpected embedding dimension ${vec.length}; expected 768 for text-embedding-004`,
          );
        }
        const literal = `[${vec.join(",")}]`;

        const row = await prisma.aiKnowledgeChunk.create({
          data: {
            documentId: doc.id,
            tenantId: input.tenantId,
            chunkIndex: i,
            text,
            chunkHash,
            embeddingModel: "text-embedding-004",
            embeddingVersion: EMBEDDING_VERSION,
          },
        });

        await prisma.$executeRawUnsafe(
          `UPDATE "ai_knowledge_chunks" SET "embedding" = $1::vector WHERE "id" = $2`,
          literal,
          row.id,
        );
      }

      await prisma.aiKnowledgeDocument.update({
        where: { id: doc.id },
        data: {
          status: "ready",
          ingestedAt: new Date(),
        },
      });

      return { documentId: doc.id, chunkCount: chunks.length };
    } catch (error) {
      await prisma.aiKnowledgeDocument.update({
        where: { id: doc.id },
        data: { status: "failed" },
      });
      throw error;
    }
  }
}
