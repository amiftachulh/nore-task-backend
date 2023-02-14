import { Router } from "express";
import { kategoriTaskRouter } from "./kategori-task.router";
import { taskRouter } from "./task.router";
import { subtaskRouter } from "./subtask.router";
import { checkDbConnection } from "./middleware";
import { eventRouter } from "./event.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection());

indexRouter.use("/kategori-task", kategoriTaskRouter);
indexRouter.use("/task", taskRouter);
indexRouter.use("/subtask", subtaskRouter);
indexRouter.use("/event", eventRouter);
