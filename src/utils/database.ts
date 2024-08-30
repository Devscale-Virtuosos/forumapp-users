import mongoose from "mongoose";

import { env } from "./env";

export async function connectMongodb() {
  return mongoose
    .connect(env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connection success!");
    })
    .catch((error) => {
      console.log("MongoDB connection failed!", error);
    });
}
