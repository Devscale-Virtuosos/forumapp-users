import mongoose from "mongoose";

export async function connectMongodb() {
  return mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("MongoDB connection success!");
    })
    .catch((error) => {
      console.log("MongoDB connection failed!", error);
    });
}
