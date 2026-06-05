import type { RequestHandler } from "express";

import { API_KEY } from "@/core/constants/headers";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { setRequestApiKey } from "@/utils/set-request-api-key";
import { env } from "@servexa-warranty-ai/env/server";

/**
 * Validates `x-api-key` against `PUBLIC_ROUTES_API_KEY` for `/` and `/health/deep`.
 * Does not use JWT or `x-client-id`.
 */
export const publicRoutesApiKeyMiddleware: RequestHandler = (req, _res, next) => {
  const configured = env.PUBLIC_ROUTES_API_KEY?.trim();
  if (!configured) {
    next(
      createOperationalError(
        "Public routes API key is not configured",
        env.NODE_ENV === "production"
          ? HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE
          : HTTP_RESPONSE_CODE.UNAUTHORIZED,
      ),
    );
    return;
  }

  const provided = req.headers[API_KEY];
  if (typeof provided !== "string" || provided !== configured) {
    next(
      createOperationalError(
        "Missing or invalid API key",
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      ),
    );
    return;
  }

  setRequestApiKey(req, "public-routes", "system", ["public"]);
  next();
};
