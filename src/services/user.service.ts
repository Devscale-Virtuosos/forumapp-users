import bcrypt from "bcrypt";

import UserRepositories from "../repositories/user.repository";
import { IUser } from "../types";
import { createError, generateErrorMessage } from "../utils/error";
import { validateInputRegister } from "../utils";

const UserServices = {
  getAll: async () => {
    try {
      const allUsers = await UserRepositories.getAll();
      return allUsers;
    } catch (error) {
      throw error;
    }
  },
  getById: async (userId: string) => {
    try {
      const user = await UserRepositories.getById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  },
  create: async (user: IUser) => {
    try {
      const { name, email, password } = user;

      // input validation
      const validationResult = validateInputRegister(user);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      // find user by email
      const existingUser = await UserRepositories.getByEmail(email);

      if (existingUser) {
        throw createError(400, `User with email ${email} already exists`);
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserRepositories.create({
        name,
        email,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  },
};

export default UserServices;
