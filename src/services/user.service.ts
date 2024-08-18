import bcrypt from "bcrypt";

import UserRepositories from "../repositories/user.repository";
import { IUser } from "../types";
import { createError } from "../utils/error";

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
      if (!name || !email || password?.length < 8) {
        throw createError(
          400,
          "name or email can not be empty, and password must contains 8 or more characters"
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
