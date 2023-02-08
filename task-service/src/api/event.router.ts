import { Router, Request, Response } from "express";
import { deleteKategoriTaskByProjectId } from "../service/kategori-task.service";
import { setNullSubtaskByUserId } from "../service/subtask.service";

export const eventRouter = Router();

eventRouter.delete(
  "/delete-kategori-task/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const kategoriTask = await deleteKategoriTaskByProjectId(id);
    if (!kategoriTask) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

eventRouter.patch("/null-user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const subtask = await setNullSubtaskByUserId(id);
  if (!subtask) return res.sendStatus(400);
  return res.sendStatus(200);
});
