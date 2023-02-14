import { Router, Request, Response } from "express";
import { BoardSchema, boardSchema } from "../schema/board.schema";
import { taskSchema, TaskSchema } from "../schema/task.schema";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  swapTask,
} from "../service/task.service";
import { checkIfAdminOrProjectManager, validate } from "./middleware";

export const taskRouter = Router();

taskRouter.post(
  "/",
  validate(taskSchema),
  checkIfAdminOrProjectManager(),
  async (req: Request, res: Response) => {
    const payload = req.body as TaskSchema;
    const task = await createTask(payload);
    if (!task) return res.sendStatus(400);
    return res.sendStatus(201);
  }
);

taskRouter.get("/", async (req: Request, res: Response) => {
  const tasks = await getAllTasks();
  if (!tasks) return res.sendStatus(404);
  return res.status(200).send(tasks);
});

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = await getTaskById(taskId);
  if (!task) return res.sendStatus(404);
  return res.status(200).send(task);
});

taskRouter.patch(
  "/swap",
  validate(boardSchema),
  async (req: Request, res: Response) => {
    const board = req.body as BoardSchema;
    const swap = await swapTask(board);
    if (!swap) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

taskRouter.patch(
  "/:id",
  validate(taskSchema),
  checkIfAdminOrProjectManager(),
  async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const payload = req.body as TaskSchema;
    const task = await updateTaskById(taskId, payload);
    if (!task) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);

taskRouter.delete(
  "/:id",
  checkIfAdminOrProjectManager(),
  async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const task = await deleteTaskById(taskId);
    if (!task) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);
