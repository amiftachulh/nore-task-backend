import { Router } from "express";
import { checkDbConnection, authenticate } from "./middleware";
import { clientRouter } from "./client.router";
import { projectRouter } from "./project.router";
import { eventRouter } from "./event.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection(), authenticate());

indexRouter.use("/client", clientRouter);
indexRouter.use("/project", projectRouter);
