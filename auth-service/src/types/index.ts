export type ResponseService<T> = {
  code: number;
  data: T;
  err: string | null;
};
