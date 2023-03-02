import { Router, Request, Response } from "express";
import { BoardSchema, boardSchema } from "../schema/board.schema";
import { taskSchema, TaskSchema } from "../schema/task.schema";
import {
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  swapTask,
} from "../service/task.service";
import { validate } from "./middleware";

export const taskRouter = Router();

taskRouter.post(
  "/",
  validate(taskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as TaskSchema;
    const task = await createTask(payload);
    if (!task) return res.status(400).send("Task gagal dibuat!");
    return res.status(201).send("Task berhasil dibuat");
  }
);

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = await getTaskById(taskId);
  if (!task) return res.status(404).send("Task tidak ditemukan");
  return res.status(200).send(task);
});

taskRouter.patch(
  "/swap",
  validate(boardSchema),
  async (req: Request, res: Response) => {
    const board = req.body as BoardSchema;
    const swap = await swapTask(board);
    if (!swap) return res.status(400).send("Task gagal diupdate!");
    return res.status(200).send("Task berhasil diupdate");
  }
);

taskRouter.patch(
  "/:id",
  validate(taskSchema),
  async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const payload = req.body as TaskSchema;
    const task = await updateTaskById(taskId, payload);
    if (!task) return res.status(400).send("Task gagal diupdate");
    return res.status(200).send("Task berhasil diupdate");
  }
);

taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = await deleteTaskById(taskId);
  if (!task) return res.status(400).send("Task gagal dihapus!");
  return res.status(200).send("Task berhasil dihapus");
});
