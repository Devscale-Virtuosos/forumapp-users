import { IAuth } from "../types";
import { Auth } from "./models/auth.schema";

const AuthRepositories = {
  getOne: async (refreshToken: string) => {
    try {
      const auth = Auth.findOne({ refreshToken });
      return auth;
    } catch (error) {
      throw error;
    }
  },
  create: async (auth: IAuth) => {
    try {
      const newRefreshToken = new Auth(auth);

      await newRefreshToken.save();
    } catch (error) {
      throw error;
    }
  },
  delete: async (refreshToken: string) => {
    try {
      await Auth.findOneAndDelete({ refreshToken });
    } catch (error) {
      throw error;
    }
  },
};

export default AuthRepositories;
