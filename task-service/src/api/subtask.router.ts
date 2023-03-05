import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import { subtaskSchema, SubtaskSchema } from "../schema/subtask.schema";
import {
  createSubtask,
  getSubtaskById,
  updateSubtaskById,
  deleteSubtaskById,
} from "../service/subtask.service";

export const subtaskRouter = Router();

subtaskRouter.post("/", validate(subtaskSchema), async (req: Request, res: Response) => {
  const payload = req.body as SubtaskSchema;
  const result = await createSubtask(payload);
  return res.status(result.code).send(result);
});

subtaskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getSubtaskById(id);
  return res.status(result.code).send(result);
});

subtaskRouter.patch("/:id", validate(subtaskSchema), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as SubtaskSchema;
  const result = await updateSubtaskById(id, payload);
  return res.status(result.code).send(result);
});

subtaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteSubtaskById(id);
  return res.status(result.code).send(result);
});
