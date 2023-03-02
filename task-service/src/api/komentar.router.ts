import { Router, Request, Response } from "express";
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
import { AuthorizedRequest, validate } from "./middleware";

export const komentarRouter = Router();

komentarRouter.post(
  "/",
  validate(komentarCreate),
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const payload = req.body as KomentarCreate;
    const komentar = await createKomentar(user.id, payload);
    if (komentar.err) return res.status(komentar.code).send(komentar.err);
    return res.status(komentar.code).send("Komentar berhasil dibuat!");
  }
);

komentarRouter.get("/:taskId", async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const komentar = await getKomentarByTaskId(taskId);
  if (komentar.err) return res.status(komentar.code).send(komentar.err);
  return res.status(komentar.code).send(komentar.data);
});

komentarRouter.patch(
  "/:id",
  validate(komentarUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = (req as AuthorizedRequest).user.id;
    const payload = req.body as KomentarUpdate;
    const komentar = await updateKomentarById(id, userId, payload);
    if (!komentar) return res.status(400).send("Komentar gagal diupdate!");
    return res.status(200).send("Komentar berhasil diupdate");
  }
);

komentarRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as AuthorizedRequest).user.id;
  const komentar = await deleteKomentarById(id, userId);
  if (!komentar) return res.status(400).send("Komentar gagal dihapus!");
  return res.status(200).send("Komentar berhasil dihapus");
});
