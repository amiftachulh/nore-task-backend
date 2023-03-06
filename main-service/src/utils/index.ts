import { ResponseService } from "../types";

export function makeResponse<T>(code: number, message: string, data: T): ResponseService<T> {
  return { code, message, data };
}
