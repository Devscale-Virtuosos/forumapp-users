import type { NextFunction, Request, Response } from "express";

import AuthServices from "../services/auth.service";
import UserServices from "../services/user.service";
import { createError } from "../utils/error";

const AuthControllers = {
  handleRegister: async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
      await UserServices.create({ name, email, password });

      res.status(201).json({ message: "User register success!" });
    } catch (error) {
      next(error);
    }
  },
  handleLogin: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const result = await AuthServices.login({ email, password });

      res
        .cookie("accessToken", result.accessToken, { httpOnly: true })
        .cookie("refreshToken", result.refreshToken, { httpOnly: true })
        .status(200)
        .json({ message: "Login success!" });
    } catch (error) {
      next(error);
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    try {
      // delete refresh token from database
      const result = await AuthServices.delete(refreshToken);

      if (!result) {
        throw createError(400, "Failed to delete refresh token");
      }

      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({ message: "Logout success!" });
    } catch (error) {
      next(error);
    }
  },
  handleVerifyAccessToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { accessToken, refreshToken } = req.body;

    try {
      const result = await AuthServices.verifyAccessToken(
        accessToken,
        refreshToken
      );

      res
        // .cookie("accessToken", result.accessToken, { httpOnly: true })
        .status(200)
        .json({ message: "Access token valid", data: result });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthControllers;
