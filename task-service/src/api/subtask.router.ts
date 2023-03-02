import { Router, Request, Response } from "express";
import { subtaskSchema, SubtaskSchema } from "../schema/subtask.schema";
import {
  createSubtask,
  getSubtaskById,
  updateSubtaskById,
  deleteSubtaskById,
} from "../service/subtask.service";
import { validate } from "./middleware";

export const subtaskRouter = Router();

subtaskRouter.post(
  "/",
  validate(subtaskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as SubtaskSchema;
    const subtask = await createSubtask(payload);
    if (!subtask) return res.status(400).send("Subtask gagal dibuat!");
    return res.status(201).send("Subtask berhasil dibuat");
  }
);

subtaskRouter.get("/:id", async (req: Request, res: Response) => {
  const subtaskId = req.params.id;
  const subtask = await getSubtaskById(subtaskId);
  if (!subtask) return res.status(404).send("Subtask tidak ditemukan!");
  return res.status(200).send(subtask);
});

subtaskRouter.patch(
  "/:id",
  validate(subtaskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as SubtaskSchema;
    const subtaskId = req.params.id;
    const subtask = await updateSubtaskById(subtaskId, payload);
    if (!subtask) return res.status(400).send("Subtask gagal diupdate!");
    return res.status(200).send("Subtask berhasil diupdate");
  }
);

subtaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const subtaskId = req.params.id;
  const subtask = await deleteSubtaskById(subtaskId);
  if (!subtask) return res.status(400).send("Subtask gagal dihapus!");
  return res.status(200).send("Subtask berhasil dihapus");
});
