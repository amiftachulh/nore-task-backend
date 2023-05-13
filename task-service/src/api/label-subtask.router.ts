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

labelSubtaskRouter.post("/", validate(labelSubtaskCreate), async (req: Request, res: Response) => {
  const payload = req.body as LabelSubtaskCreate;
  const result = await createLabelSubtask(payload);
  return res.status(result.code).json(result);
});

labelSubtaskRouter.get("/:subtaskId", async (req: Request, res: Response) => {
  const subtaskId = req.params.subtaskId;
  const result = await getLabelSubtaskBySubtaskId(subtaskId);
  return res.status(result.code).json(result);
});

labelSubtaskRouter.patch(
  "/:id",
  validate(labelSubtaskUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as LabelSubtaskUpdate;
    const result = await updateLabelSubtaskById(id, payload);
    return res.status(result.code).json(result);
  }
);

labelSubtaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteLabelSubtaskById(id);
  return res.status(result.code).json(result);
});
