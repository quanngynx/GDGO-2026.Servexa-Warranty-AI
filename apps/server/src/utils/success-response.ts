import { type Response } from 'express';
import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_MESSAGE } from '@/core/constants/http.constant';
export interface ErrorResponseProps {
  message?: string;
  status?: number;
}

export interface SuccessResponseProps<TMetadata> extends ErrorResponseProps {
  reasonStatusCode?: string;
  metadata: TMetadata;
}

export interface OKProps<TRes> {
  message?: string;
  status?: number;
  reasonStatusCode?: string;
  metadata: TRes;
}

export interface CreatedProps<TRes> {
  message?: string;
  status?: number;
  reasonStatusCode?: string;
  metadata: TRes;
  option?: object;
}

export class SuccessResponse<TRes> {
  message: string;
  status: number;
  metadata: TRes;

  constructor({
    message,
    status = HTTP_RESPONSE_CODE.OK,
    reasonStatusCode = HTTP_RESPONSE_MESSAGE[HTTP_RESPONSE_CODE.OK],
    metadata
  }: SuccessResponseProps<TRes>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (this.message = message ?? reasonStatusCode), (this.status = status);
    this.metadata = metadata;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(res: Response, _headers: object = {}) {
    return res.status(this.status).json(this);
  }
}

export class OK<TRes> extends SuccessResponse<TRes> {
  constructor({ message, metadata }: OKProps<TRes>) {
    super({ message, metadata });
  }
}

export class CREATED<Tres> extends SuccessResponse<Tres> {
  option?: object;

  constructor({
    message,
    status = HTTP_RESPONSE_CODE.CREATED,
    reasonStatusCode = HTTP_RESPONSE_MESSAGE[HTTP_RESPONSE_CODE.CREATED],
    metadata,
    option = {}
  }: CreatedProps<Tres>) {
    super({ message, status, reasonStatusCode, metadata });
    this.option = option;
  }
}
