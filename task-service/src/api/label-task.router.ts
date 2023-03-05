import { Router, Request, Response } from "express";
import { validate } from "./middleware";
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

export const labelTaskRouter = Router();

labelTaskRouter.post("/", validate(labelTaskCreate), async (req: Request, res: Response) => {
  const payload = req.body as LabelTaskCreate;
  const result = await createLabelTask(payload);
  return res.status(result.code).send(result);
});

labelTaskRouter.get("/:taskId", async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const result = await getLabelTaskByTaskId(taskId);
  return res.status(result.code).send(result);
});

labelTaskRouter.patch("/:id", validate(labelTaskUpdate), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as LabelTaskUpdate;
  const result = await updateLabelTaskById(id, payload);
  return res.status(result.code).send(result);
});

labelTaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteLabelTaskById(id);
  return res.status(result.code).send(result);
});
