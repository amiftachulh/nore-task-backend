import { Router } from "express";
import { checkDbConnection, authenticate } from "./middleware";
import { clientRouter } from "./client.router";
import { projectRouter } from "./project.router";
import { eventRouter } from "./event.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection());

indexRouter.use("/client", authenticate(), clientRouter);
indexRouter.use("/project", authenticate(), projectRouter);
indexRouter.use("/event", eventRouter);
