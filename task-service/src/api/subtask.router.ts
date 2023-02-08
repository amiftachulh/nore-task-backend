import { Router, Request, Response } from "express";
import { subtaskSchema, SubtaskSchema } from "../schema/subtask.schema";
import {
  createSubtask,
  getAllSubtasks,
  getSubtaskById,
  updateSubtaskById,
  deleteSubtaskById,
  setNullSubtaskByUserId,
} from "../service/subtask.service";
import { validate } from "./middleware";

export const subtaskRouter = Router();

subtaskRouter.post(
  "/",
  validate(subtaskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as SubtaskSchema;
    const subtask = await createSubtask(payload);
    if (!subtask) return res.sendStatus(400);
    return res.sendStatus(201);
  }
);

subtaskRouter.get("/", async (req: Request, res: Response) => {
  const subtasks = await getAllSubtasks();
  if (!subtasks) return res.sendStatus(404);
  return res.status(200).send(subtasks);
});

subtaskRouter.get("/:id", async (req: Request, res: Response) => {
  const subtaskId = req.params.id;
  const subtask = await getSubtaskById(subtaskId);
  if (!subtask) return res.sendStatus(404);
  return res.status(200).send(subtask);
});

subtaskRouter.patch(
  "/:id",
  validate(subtaskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as SubtaskSchema;
    const subtaskId = req.params.id;
    const subtask = await updateSubtaskById(subtaskId, payload);
    if (!subtask) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);

subtaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const subtaskId = req.params.id;
  const subtask = await deleteSubtaskById(subtaskId);
  if (!subtask) return res.sendStatus(404);
  return res.sendStatus(200);
});
