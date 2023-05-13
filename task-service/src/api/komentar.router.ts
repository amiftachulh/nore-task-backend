import { Router, Request, Response } from "express";
import { AuthorizedRequest, validate } from "./middleware";
import {
  komentarCreate,
  KomentarCreate,
  komentarUpdate,
  KomentarUpdate,
} from "../schema/komentar.schema";
import {
  createKomentar,
  deleteKomentarById,
  getKomentarByTaskId,
  updateKomentarById,
} from "../service/komentar.service";

export const komentarRouter = Router();

komentarRouter.post("/", validate(komentarCreate), async (req: Request, res: Response) => {
  const user = (req as AuthorizedRequest).user;
  const payload = req.body as KomentarCreate;
  const result = await createKomentar(user.id, payload);
  return res.status(result.code).json(result);
});

komentarRouter.get("/:taskId", async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const result = await getKomentarByTaskId(taskId);
  return res.status(result.code).json(result);
});

komentarRouter.patch("/:id", validate(komentarUpdate), async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as AuthorizedRequest).user.id;
  const payload = req.body as KomentarUpdate;
  const result = await updateKomentarById(id, userId, payload);
  return res.status(result.code).json(result);
});

komentarRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = (req as AuthorizedRequest).user;
  const result = await deleteKomentarById(id, user);
  return res.status(result.code).json(result);
});
