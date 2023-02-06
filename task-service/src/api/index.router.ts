import { Router } from "express";
import { kategoriTaskRouter } from "./kategori-task.router";
import { taskRouter } from "./task.router";
import { subtaskRouter } from "./subtask.router";
import {
  authenticate,
  checkDbConnection,
  checkIfAdminOrProjectManager,
} from "./middleware";

export const indexRouter = Router();

indexRouter.use(checkDbConnection(), authenticate());

indexRouter.use("/kategori-task", kategoriTaskRouter);
indexRouter.use("/task", checkIfAdminOrProjectManager(), taskRouter);
indexRouter.use("/subtask", subtaskRouter);
