export type BaseApiResponse<T> = {
  title: string;
  detail: string;
  status: number;
  data: T;
  errors:
    | {
        field: string;
        message: string;
      }
    | {
        field: string;
        message: string;
      }[]
    | object
    | null;
};
