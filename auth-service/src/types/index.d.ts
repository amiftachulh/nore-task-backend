export type ResponseService<T> = {
  code: number;
  message: string;
  data: T;
};
