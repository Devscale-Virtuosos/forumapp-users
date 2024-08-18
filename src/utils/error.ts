import { ICustomError } from "../types";

export function createError(code: number, message: string): ICustomError {
  return {
    statusCode: code,
    message,
  };
}
