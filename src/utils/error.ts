import { ZodIssue } from "zod";
import { ICustomError } from "../types";

export function createError(code: number, message: string): ICustomError {
  return {
    statusCode: code,
    message,
  };
}

export function generateErrorMessage(zodIssues: ZodIssue[]) {
  return `${zodIssues[0].path.join(
    ", "
  )} is ${zodIssues[0].message.toLowerCase()}`;
}
