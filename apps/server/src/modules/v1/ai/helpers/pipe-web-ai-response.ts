import type { ReadableStream } from "node:stream/web";

import { Readable } from "node:stream";
import type { Response as ExpressResponse } from "express";

/** Bridges Web `fetch` Responses from the AI SDK to Express streaming. */
export function pipeAiWebResponseToExpress(
  webAi: globalThis.Response,
  res: ExpressResponse,
): void {
  const ctype = webAi.headers.get("content-type");
  if (ctype) {
    res.setHeader("Content-Type", ctype);
  }

  const status =
    typeof webAi.status === "number" && Number.isFinite(webAi.status)
      ? webAi.status
      : 200;
  res.status(status);

  const webBody = webAi.body;
  if (!webBody) {
    res.end();
    return;
  }

  Readable.fromWeb(webBody as unknown as ReadableStream).pipe(res);
}
