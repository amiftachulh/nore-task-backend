import { Router, Request, Response } from "express";
import { deleteKategoriTaskByProjectId } from "../service/kategori-task.service";
import { setNullSubtaskByUserId } from "../service/subtask.service";

export const eventRouter = Router();

eventRouter.post("/delete-kategori-task", async (req: Request, res: Response) => {
  const projectIds = req.body.projectIds as string[];
  const result = await deleteKategoriTaskByProjectId(projectIds);
  return res.status(result.code).json(result);
});

eventRouter.patch("/null-user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await setNullSubtaskByUserId(id);
  return res.status(result.code).json(result);
});
