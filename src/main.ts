import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { checkOriginMiddleware } from "./middlewares/check-origin.middleware";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { userRouter } from "./routes/user.route";
import { connectMongodb } from "./utils/database";

dotenv.config();
connectMongodb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(checkOriginMiddleware);

/**
 * Routes
 */
app.use("/", userRouter);

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running at port: ${process.env.PORT ?? 8000}`);
});
