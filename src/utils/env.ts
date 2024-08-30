import { cleanEnv, port, str, url } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: url(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES_TIME: str(),
  JWT_REFRESH_EXPIRES_TIME: str(),
});
