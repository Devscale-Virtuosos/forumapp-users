import { User } from "./models/user.schema";
import { IUser } from "../types";

const UserRepositories = {
  getAll: async () => {
    try {
      const allUsers = await User.find();
      return allUsers;
    } catch (error) {
      throw error;
    }
  },
  getById: async (userId: string) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  },
  getByEmail: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  },
  create: async (user: IUser) => {
    try {
      const createUser = new User(user);

      const newUser = await createUser.save();

      return newUser;
    } catch (error) {
      throw error;
    }
  },
};

export default UserRepositories;
