import express from "express";
import UserControllers from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/", UserControllers.handleGetAllUsers);
userRouter.get("/:id", UserControllers.handleGetUserById);
