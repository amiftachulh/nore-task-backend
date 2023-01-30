import { Router } from "express";
import { kategoriTaskRouter } from "./kategori-task.router";
import { taskRouter } from "./task.router";
import { subtaskRouter } from "./subtask.router";

export const indexRouter = Router();

indexRouter.use("/kategori-task", kategoriTaskRouter);
indexRouter.use("/task", taskRouter);
indexRouter.use("/subtask", subtaskRouter);
