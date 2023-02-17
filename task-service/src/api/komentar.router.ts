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
import {
  AuthorizedRequest,
  createKomentarAuth,
  deleteKomentarAuth,
  updateKomentarAuth,
  validate,
} from "./middleware";

export const komentarRouter = Router();

komentarRouter.post(
  "/",
  validate(komentarCreate),
  createKomentarAuth(),
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
  updateKomentarAuth(),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as KomentarUpdate;
    const komentar = await updateKomentarById(id, payload);
    if (!komentar) return res.status(400).send("Update komentar gagal!");
    return res.status(200).send("Update komentar berhasil");
  }
);

komentarRouter.delete(
  "/:id",
  deleteKomentarAuth(),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const komentar = await deleteKomentarById(id);
    if (!komentar) return res.status(400).send("Komentar tidak dapat dihapus!");
    return res.status(200).send("Komentar berhasil dihapus");
  }
);
