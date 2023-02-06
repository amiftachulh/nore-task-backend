import { Router } from "express";
import { checkDbConnection, authenticate, checkIfAdmin } from "./middleware";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { roleRouter } from "./role.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection());

indexRouter.use("/auth", authRouter);
indexRouter.use("/user", authenticate(), userRouter);
indexRouter.use("/role", authenticate(), checkIfAdmin(), roleRouter);
