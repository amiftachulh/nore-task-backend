import { Router, Request, Response } from "express";
import {
  LabelTaskCreate,
  labelTaskCreate,
  LabelTaskUpdate,
  labelTaskUpdate,
} from "../schema/label-task.schema";
import {
  createLabelTask,
  deleteLabelTaskById,
  getLabelTaskByTaskId,
  updateLabelTaskById,
} from "../service/label-task.service";
import { validate } from "./middleware";

export const labelTaskRouter = Router();

labelTaskRouter.post(
  "/",
  validate(labelTaskCreate),
  async (req: Request, res: Response) => {
    const payload = req.body as LabelTaskCreate;
    const labelTask = await createLabelTask(payload);
    if (!labelTask) return res.status(400).send("Label task gagal dibuat!");
    return res.status(201).send("Label task berhasil dibuat");
  }
);

labelTaskRouter.get("/:taskId", async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const labelTask = await getLabelTaskByTaskId(taskId);
  if (!labelTask) return res.status(404).send("Label task tidak ditemukan!");
  return res.status(200).send(labelTask);
});

labelTaskRouter.patch(
  "/:id",
  validate(labelTaskUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as LabelTaskUpdate;
    const labelTask = await updateLabelTaskById(id, payload);
    if (!labelTask) return res.status(400).send("Label task gagal diupdate!");
    return res.status(200).send("Label task berhasil diupdate");
  }
);

labelTaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const labelTask = await deleteLabelTaskById(id);
  if (!labelTask) return res.status(400).send("Label task gagal dihapus!");
  return res.status(200).send("Label task berhasil dihapus");
});
