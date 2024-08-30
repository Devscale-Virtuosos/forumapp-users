import { model, Schema } from "mongoose";

// schema
const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
