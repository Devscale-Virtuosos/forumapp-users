import type { NextFunction, Request, Response } from "express";

import UserServices from "../services/user.service";
import AuthServices from "../services/auth.service";
import { createError } from "../utils/error";

const UserControllers = {
  handleGetAllUsers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const allUsers = await UserServices.getAll();

      res
        .status(200)
        .json({ message: "Successfully get all users", data: allUsers });
    } catch (error) {
      next(error);
    }
  },
  handleRegisterUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password } = req.body;

    try {
      await UserServices.create({ name, email, password });

      res.status(201).json({ message: "User register success!" });
    } catch (error) {
      next(error);
    }
  },
  handleLoginUser: async (req: Request, res: Response, next: NextFunction) => {
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
  handleLogoutUser: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    try {
      // delete refresh token from database
      await AuthServices.delete(refreshToken);

      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({ message: "Logout success!" });
    } catch (error) {
      next(error);
    }
  },
  handleGetUserById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await UserServices.getById(req.params.id);

      if (!user) {
        throw createError(404, "user not found");
      }

      res.status(200).json({ message: "Successfully get user", data: user });
    } catch (error) {
      next(error);
    }
  },
};

export default UserControllers;
