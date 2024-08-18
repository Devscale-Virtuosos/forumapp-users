import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepositories from "../repositories/user.repository";
import { IUser } from "../types";
import { createError } from "../utils/error";
import AuthRepositories from "../repositories/auth.repository";

const AuthServices = {
  login: async (credential: Omit<IUser, "name">) => {
    try {
      const { email, password } = credential;

      // input validation
      if (!email || password?.length < 8) {
        throw createError(400, "name or password can not be empty");
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

      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME || 3600 }
      );

      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME || "7d" }
      );

      // save refresh token to database
      await AuthRepositories.create({ userId: user.id, refreshToken });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },
  delete: async (refreshToken: string) => {
    try {
      await AuthRepositories.delete(refreshToken);
    } catch (error) {
      throw error;
    }
  },
};

export default AuthServices;
