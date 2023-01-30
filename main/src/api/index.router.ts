import { Router } from "express";
import { clientRouter } from "./client.router";
import { projectRouter } from "./project.router";

export const indexRouter = Router();

indexRouter.use("/client", clientRouter);
indexRouter.use("/project", projectRouter);
