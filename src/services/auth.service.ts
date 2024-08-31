import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepositories from "../repositories/user.repository";
import AuthRepositories from "../repositories/auth.repository";
import { ITokenPayload, IUser } from "../types";
import {
  createError,
  env,
  generateErrorMessage,
  validateInputLogin,
} from "../utils";

const AuthServices = {
  login: async (credential: Omit<IUser, "name">) => {
    try {
      const { email, password } = credential;

      // input validation
      const validationResult = validateInputLogin(credential);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      // find user by email
      const user = await UserRepositories.getByEmail(email);

      if (!user) {
        throw createError(404, "user not found");
      }

      if (!user.password) {
        throw createError(400, "password not set");
      }

      // password validation
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw createError(403, "invalid password");
      }

      // authorization
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_TIME || 3600,
      });

      const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_TIME || "7d",
      });

      // save refresh token to database
      await AuthRepositories.create({ userId: user.id, refreshToken });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },
  delete: async (refreshToken: string) => {
    try {
      const result = await AuthRepositories.delete(refreshToken);
      return result;
    } catch (error) {
      throw error;
    }
  },
  verifyAccessToken: async (accessToken: string, refreshToken: string) => {
    // check if access token exists
    if (!accessToken) {
      throw createError(401, "accressToken not provided");
    }

    try {
      jwt.verify(accessToken, env.JWT_ACCESS_SECRET);
      return { valid: true, accessToken: null };
    } catch (_) {
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
          throw createError(401, "please re-login...");
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

        return { valid: true, accessToken: newAccessToken };
      } catch (error) {
        throw error;
      }
    }
  },
};

export default AuthServices;
