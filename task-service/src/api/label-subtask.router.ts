import { Router, Request, Response } from "express";
import {
  LabelSubtaskCreate,
  labelSubtaskCreate,
  LabelSubtaskUpdate,
  labelSubtaskUpdate,
} from "../schema/label-subtask.schema";
import {
  createLabelSubtask,
  deleteLabelSubtaskById,
  getLabelSubtaskBySubtaskId,
  updateLabelSubtaskById,
} from "../service/label-subtask.service";
import { validate } from "./middleware";

export const labelSubtaskRouter = Router();

labelSubtaskRouter.post(
  "/",
  validate(labelSubtaskCreate),
  async (req: Request, res: Response) => {
    const payload = req.body as LabelSubtaskCreate;
    const labelSubtask = await createLabelSubtask(payload);
    if (!labelSubtask)
      return res.status(400).send("Label subtask gagal dibuat!");
    return res.status(201).send("Label subtask berhasil dibuat");
  }
);

labelSubtaskRouter.get("/:subtaskId", async (req: Request, res: Response) => {
  const subtaskId = req.params.subtaskId;
  const labelSubtask = await getLabelSubtaskBySubtaskId(subtaskId);
  if (!labelSubtask)
    return res.status(404).send("Label subtask tidak ditemukan!");
  return res.status(200).send(labelSubtask);
});

labelSubtaskRouter.patch(
  "/:id",
  validate(labelSubtaskUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as LabelSubtaskUpdate;
    const labelSubtask = await updateLabelSubtaskById(id, payload);
    if (!labelSubtask)
      return res.status(400).send("Label subtask gagal diupdate!");
    return res.status(200).send("Label subtask berhasil diupdate");
  }
);

labelSubtaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const labelSubtask = await deleteLabelSubtaskById(id);
  if (!labelSubtask)
    return res.status(400).send("Label subtask gagal dihapus!");
  return res.status(200).send("Label subtask berhasil dihapus");
});
