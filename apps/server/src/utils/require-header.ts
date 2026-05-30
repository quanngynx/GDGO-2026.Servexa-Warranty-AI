import type { Request } from "express";

import { createOperationalError } from "@/middlewares/error-middleware";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { getHeaderValue } from "./get-header-value";

/**
 * Get the required header value, if not found, throw an error.
 *
 * @param req Express Request
 * @param headerKey The name of the header (string) like CLIENT_ID, etc.
 * @param errorMessage The error message if the header is missing
 */
export function requireHeader(
    req: Request,
    headerKey: string,
    errorMessage: string = `Missing ${headerKey}`,
  ): string {
    const raw = getHeaderValue(req, headerKey);
    if (!raw)
      throw createOperationalError(errorMessage, HTTP_RESPONSE_CODE.BAD_REQUEST);

    return raw;
  }