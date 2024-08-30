import express from "express";
import UserControllers from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares";

export const userRouter = express.Router();

userRouter.post("/register", UserControllers.handleRegisterUser);
userRouter.post("/login", UserControllers.handleLoginUser);
userRouter.post("/logout", UserControllers.handleLogoutUser);
userRouter.get("/", verifyAccessToken, UserControllers.handleGetAllUsers);
userRouter.get("/:id", verifyAccessToken, UserControllers.handleGetUserById);
