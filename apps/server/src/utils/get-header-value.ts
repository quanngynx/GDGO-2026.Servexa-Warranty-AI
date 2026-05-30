import type { Request } from "express";

export const getHeaderValue = (
  req: Request,
  headerName: string
): string | undefined => req.get(headerName);
