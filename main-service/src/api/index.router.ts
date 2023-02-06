import { Router } from "express";
import { authenticate, checkDbConnection, checkIfAdmin } from "./middleware";
import { clientRouter } from "./client.router";
import { projectRouter } from "./project.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection(), authenticate());

indexRouter.use("/client", checkIfAdmin(), clientRouter);
indexRouter.use("/project", projectRouter);
