import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import { BoardSchema, boardSchema } from "../schema/board.schema";
import { taskSchema, TaskSchema } from "../schema/task.schema";
import {
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  swapTask,
} from "../service/task.service";

export const taskRouter = Router();

taskRouter.post("/", validate(taskSchema), async (req: Request, res: Response) => {
  const payload = req.body as TaskSchema;
  const result = await createTask(payload);
  return res.status(result.code).json(result);
});

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getTaskById(id);
  return res.status(result.code).json(result);
});

taskRouter.patch("/swap", validate(boardSchema), async (req: Request, res: Response) => {
  const payload = req.body as BoardSchema;
  const result = await swapTask(payload);
  return res.status(result.code).json(result);
});

taskRouter.patch("/:id", validate(taskSchema), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as TaskSchema;
  const result = await updateTaskById(id, payload);
  return res.status(result.code).json(result);
});

taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteTaskById(id);
  return res.status(result.code).json(result);
});
