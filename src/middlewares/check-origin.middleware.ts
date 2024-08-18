import type { NextFunction, Request, Response } from "express";
import { createError } from "../utils/error";

/**
 * Middleware to prevent direct access to services (not through api gateway)
 */
export async function checkOriginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // IF access through API Gateway THEN next, 8010 -> api gateway's port
  if (req.headers.host?.includes("8010")) {
    console.log("HOST:", req.headers.host);
    return next();
  }

  console.log("KE SINI");

  // IF access directly
  next(createError(403, "You are not allowed to do direct request"));
}
