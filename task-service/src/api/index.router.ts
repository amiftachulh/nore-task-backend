import { Router } from "express";
import { checkDbConnection, authenticate } from "./middleware";
import { kategoriTaskRouter } from "./kategori-task.router";
import { taskRouter } from "./task.router";
import { labelTaskRouter } from "./label-task.router";
import { subtaskRouter } from "./subtask.router";
import { labelSubtaskRouter } from "./label-subtask.router";
import { komentarRouter } from "./komentar.router";
import { eventRouter } from "./event.router";

export const indexRouter = Router();

indexRouter.use(checkDbConnection(), authenticate());

indexRouter.use("/kategori-task", kategoriTaskRouter);
indexRouter.use("/task", taskRouter);
indexRouter.use("/label-task", labelTaskRouter);
indexRouter.use("/komentar", komentarRouter);
indexRouter.use("/subtask", subtaskRouter);
indexRouter.use("/label-subtask", labelSubtaskRouter);
