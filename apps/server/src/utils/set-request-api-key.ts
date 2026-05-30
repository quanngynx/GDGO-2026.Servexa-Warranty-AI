import type { Request } from "express";

export function setRequestApiKey(
  req: Request,
  apiKeyId: string,
  apiKeyCreatedBy: string,
  apiKeyScopes: string[] =  []
) {
  req.apiKey = {
    keyId: apiKeyId,
    owner: apiKeyCreatedBy,
    scopes: apiKeyScopes,
  };
}
