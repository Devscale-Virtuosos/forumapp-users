import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { checkOriginMiddleware, errorHandlerMiddleware } from "./middlewares";
import { userRouter } from "./routes/user.route";
import { connectMongodb, env } from "./utils";

connectMongodb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));
app.use(checkOriginMiddleware);

/**
 * Routes
 */
app.use("/", userRouter);

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(env.PORT || 8000, () => {
  console.log(`Server running at port: ${env.PORT ?? 8000}`);
});
