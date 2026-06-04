import { google } from "@ai-sdk/google";
import { embed } from "ai";
import prisma from "@/core/infra/prisma";

import { logger } from "@/core/logging";

const CACHE_TTL_MS = 60_000;
const retrievalCache = new Map<string, { at: number; rows: RetrievedChunk[] }>();

export type RetrievedChunk = {
  chunkId: string;
  documentId: string;
  text: string;
  /** Lower is better (cosine distance). */
  distance: number;
  /** True when query keywords appear in chunk text (cheap lexical signal). */
  lexicalHit: boolean;
  score: number;
};

type HybridRow = {
  id: string;
  document_id: string;
  text: string;
  dist: number;
  lex: number;
};

function computeHybridScore(dist: number, lex: number): number {
  return (1 - dist) + (lex === 1 ? 0.08 : 0);
}

function contextualCompress(text: string, query: string): string {
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx < 0) {
    return text.slice(0, 700);
  }
  const start = Math.max(0, idx - 200);
  const end = Math.min(text.length, idx + q.length + 450);
  return text.slice(start, end);
}

export class KnowledgeRetrievalService {
  async hybridSearch(params: {
    tenantId: string;
    query: string;
    documentScope?: string;
    topK?: number;
  }): Promise<RetrievedChunk[]> {
    const topK = params.topK ?? 5;
    const cacheKey = `${params.tenantId}::${params.documentScope ?? "*"}::${params.query}::${topK}`;
    const hit = retrievalCache.get(cacheKey);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      logger.info("[rag-retrieval] cache_hit", {
        tenantId: params.tenantId,
        documentScope: params.documentScope,
        topK,
      });
      return hit.rows;
    }

    const { embedding } = await embed({
      model: google.embeddingModel("text-embedding-004"),
      value: params.query,
    });
    const literal = `[${embedding.join(",")}]`;
    const like = `%${params.query.replace(/[%_]/g, (c) => `\\${c}`).slice(0, 240)}%`;

    let rows: HybridRow[] = [];
    if (params.documentScope?.trim()) {
      rows = await prisma.$queryRawUnsafe<HybridRow[]>(
        `
        SELECT
          c."id",
          c."document_id",
          c."text",
          (c."embedding" <=> $1::vector)::float8 AS dist,
          CASE WHEN c."text" ILIKE $2 ESCAPE '\\' THEN 1 ELSE 0 END AS lex
        FROM "ai_knowledge_chunks" c
        JOIN "ai_knowledge_documents" d ON d."id" = c."document_id"
        WHERE c."tenant_id" = $3
          AND d."document_scope" = $4
          AND c."embedding" IS NOT NULL
        ORDER BY (c."embedding" <=> $1::vector) - (CASE WHEN c."text" ILIKE $2 ESCAPE '\\' THEN 0.08 ELSE 0 END)
        LIMIT $5
        `,
        literal,
        like,
        params.tenantId,
        params.documentScope.trim(),
        topK,
      );
    } else {
      rows = await prisma.$queryRawUnsafe<HybridRow[]>(
        `
        SELECT
          c."id",
          c."document_id",
          c."text",
          (c."embedding" <=> $1::vector)::float8 AS dist,
          CASE WHEN c."text" ILIKE $2 ESCAPE '\\' THEN 1 ELSE 0 END AS lex
        FROM "ai_knowledge_chunks" c
        WHERE c."tenant_id" = $3 AND c."embedding" IS NOT NULL
        ORDER BY (c."embedding" <=> $1::vector) - (CASE WHEN c."text" ILIKE $2 ESCAPE '\\' THEN 0.08 ELSE 0 END)
        LIMIT $4
        `,
        literal,
        like,
        params.tenantId,
        topK,
      );
    }

    // rerank with explicit hybrid score and compress context before returning
    const mapped: RetrievedChunk[] = rows
      .map((r) => ({
        chunkId: r.id,
        documentId: r.document_id,
        text: contextualCompress(r.text, params.query),
        distance: r.dist,
        lexicalHit: r.lex === 1,
        score: computeHybridScore(r.dist, r.lex),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    retrievalCache.set(cacheKey, { at: Date.now(), rows: mapped });
    logger.info("[rag-retrieval] hybrid_complete", {
      tenantId: params.tenantId,
      documentScope: params.documentScope,
      topK,
      rowCount: mapped.length,
    });
    return mapped;
  }

  formatAsPromptBlock(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) return "";
    return chunks
      .map((s, i) => `[#${i + 1}] chunkId=${s.chunkId} ${s.text}`)
      .join("\n\n");
  }
}
