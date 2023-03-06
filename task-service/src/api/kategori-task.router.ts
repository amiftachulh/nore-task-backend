import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import {
  kategoriTaskCreate,
  KategoriTaskCreate,
  KategoriTaskUpdate,
  kategoriTaskUpdate,
} from "../schema/kategori-task.schema";
import {
  createKategoriTask,
  getKategoriTaskByProjectId,
  updateKategoriTaskById,
  deleteKategoriTaskById,
  swapKategoriTask,
} from "../service/kategori-task.service";
import { BoardSchema, boardSchema } from "../schema/board.schema";

export const kategoriTaskRouter = Router();

kategoriTaskRouter.post("/", validate(kategoriTaskCreate), async (req: Request, res: Response) => {
  const payload = req.body as KategoriTaskCreate;
  const result = await createKategoriTask(payload);
  return res.status(result.code).send(result);
});

kategoriTaskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getKategoriTaskByProjectId(id);
  return res.status(result.code).send(result);
});

kategoriTaskRouter.patch("/swap", validate(boardSchema), async (req: Request, res: Response) => {
  const payload = req.body as BoardSchema;
  const result = await swapKategoriTask(payload);
  return res.status(result.code).send(result);
});

kategoriTaskRouter.patch(
  "/:id",
  validate(kategoriTaskUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as KategoriTaskUpdate;
    const result = await updateKategoriTaskById(id, payload);
    return res.status(result.code).send(result);
  }
);

kategoriTaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteKategoriTaskById(id);
  return res.status(result.code).send(result);
});
