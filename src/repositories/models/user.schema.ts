import { model, Schema } from "mongoose";

// schema
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

export const User = model("User", userSchema);
