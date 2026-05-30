export type BaseApiResponse<T> = {
  message: string;
  status: number;
  metadata: T;
};
