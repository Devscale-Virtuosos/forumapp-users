import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import AuthRepositories from "../repositories/auth.repository";
import { ITokenPayload } from "../types";
import { createError, env } from "../utils";

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  // check if access token exists
  if (accessToken) {
    try {
      jwt.verify(accessToken, env.JWT_ACCESS_SECRET);
      next();
    } catch (error) {
      // access token invalid -> generate new one

      try {
        // check if refresh token exists
        if (!refreshToken) {
          throw createError(401, "please re-login...");
        }

        // check if refresh token valid
        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

        // IF refresh token valid THEN check if exists in database
        const activeRefreshToken = await AuthRepositories.getOne(refreshToken);

        if (!activeRefreshToken) {
          throw createError(401, "please re-login");
        }

        const payload = jwt.decode(refreshToken) as ITokenPayload;

        // generate new access token
        const newAccessToken = jwt.sign(
          {
            id: payload.id,
            name: payload.name,
            email: payload.email,
          },
          env.JWT_ACCESS_SECRET,
          { expiresIn: env.JWT_ACCESS_EXPIRES_TIME || 3600 }
        );

        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        next();
      } catch (error) {
        next(error);
      }
    }
  } else {
    next(createError(401, "access token not provided"));
  }
}
