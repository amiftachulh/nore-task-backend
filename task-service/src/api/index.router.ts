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

indexRouter.use(checkDbConnection());

indexRouter.use("/kategori-task", authenticate(), kategoriTaskRouter);
indexRouter.use("/task", authenticate(), taskRouter);
indexRouter.use("/label-task", authenticate(), labelTaskRouter);
indexRouter.use("/komentar", authenticate(), komentarRouter);
indexRouter.use("/subtask", authenticate(), subtaskRouter);
indexRouter.use("/label-subtask", authenticate(), labelSubtaskRouter);
indexRouter.use("/event", eventRouter);
