import { Router } from "express";
import { checkDbConnection, authenticate, authorize } from "./middleware";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { roleRouter } from "./role.router";
import { eventRouter } from "./event.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection());

indexRouter.use("/auth", authRouter);
indexRouter.use("/user", authenticate(), userRouter);
indexRouter.use("/role", authenticate(), authorize(["Admin"]), roleRouter);
indexRouter.use("/event", eventRouter);
