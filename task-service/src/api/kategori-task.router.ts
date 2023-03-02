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

kategoriTaskRouter.post(
  "/",
  validate(kategoriTaskCreate),
  async (req: Request, res: Response) => {
    const payload = req.body as KategoriTaskCreate;
    const kategoriTask = await createKategoriTask(payload);
    if (!kategoriTask)
      return res.status(400).send("Kategori task gagal dibuat!");
    return res.status(201).send("Kategori task berhasil dibuat");
  }
);

kategoriTaskRouter.get("/:id", async (req: Request, res: Response) => {
  const kategoriTaskId = req.params.id;
  const kategoriTask = await getKategoriTaskByProjectId(kategoriTaskId);
  if (!kategoriTask)
    return res.status(404).send("Kategori task tidak ditemukan!");
  return res.status(200).send(kategoriTask);
});

kategoriTaskRouter.patch(
  "/swap",
  validate(boardSchema),
  async (req: Request, res: Response) => {
    const board = req.body as BoardSchema;
    const swap = await swapKategoriTask(board);
    if (!swap) return res.status(400).send("Kategori task gagal diupdate!");
    return res.status(200).send("Kategori task berhasil diupdate");
  }
);

kategoriTaskRouter.patch(
  "/:id",
  validate(kategoriTaskUpdate),
  async (req: Request, res: Response) => {
    const kategoriTaskId = req.params.id;
    const payload = req.body as KategoriTaskUpdate;
    const kategoriTask = await updateKategoriTaskById(kategoriTaskId, payload);
    if (!kategoriTask)
      return res.status(400).send("Kategori task gagal diupdate!");
    return res.status(200).send("Kategori task berhasil diupdate");
  }
);

kategoriTaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const kategoriTaskId = req.params.id;
  const kategoriTask = await deleteKategoriTaskById(kategoriTaskId);
  if (!kategoriTask)
    return res.status(400).send("Kategori task gagal dihapus!");
  return res.status(200).send("Kategori task berhasil dihapus");
});
