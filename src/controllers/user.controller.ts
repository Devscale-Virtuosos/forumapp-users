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
