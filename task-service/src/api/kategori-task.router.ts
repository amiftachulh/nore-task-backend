import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import {
  kategoriTaskSchema,
  KategoriTaskSchema,
  KategoriTaskUpdate,
  kategoriTaskUpdate,
} from "../schema/kategori-task.schema";
import {
  createKategoriTask,
  getAllKategoriTasks,
  getKategoriTaskById,
  updateKategoriTaskById,
  deleteKategoriTaskById,
  swapKategoriTask,
  deleteKategoriTaskByProjectId,
} from "../service/kategori-task.service";
import { BoardSchema, boardSchema } from "../schema/board.schema";

export const kategoriTaskRouter = Router();

kategoriTaskRouter.post(
  "/",
  validate(kategoriTaskSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as KategoriTaskSchema;
    const kategoriTask = await createKategoriTask(payload);
    if (!kategoriTask) return res.sendStatus(400);
    return res.sendStatus(201);
  }
);

kategoriTaskRouter.get("/", async (req: Request, res: Response) => {
  const kategoriTasks = await getAllKategoriTasks();
  if (!kategoriTasks) return res.sendStatus(404);
  return res.status(200).send(kategoriTasks);
});

kategoriTaskRouter.get("/:id", async (req: Request, res: Response) => {
  const kategoriTaskId = req.params.id;
  const kategoriTask = await getKategoriTaskById(kategoriTaskId);
  if (!kategoriTask) return res.sendStatus(404);
  return res.status(200).send(kategoriTask);
});

kategoriTaskRouter.patch(
  "/swap",
  validate(boardSchema),
  async (req: Request, res: Response) => {
    const board = req.body as BoardSchema;
    const swap = await swapKategoriTask(board);
    if (!swap) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

kategoriTaskRouter.patch(
  "/:id",
  validate(kategoriTaskUpdate),
  async (req: Request, res: Response) => {
    const kategoriTaskId = req.params.id;
    const payload = req.body as KategoriTaskUpdate;
    const kategoriTask = await updateKategoriTaskById(kategoriTaskId, payload);
    if (!kategoriTask) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);

kategoriTaskRouter.delete(
  "/delete-project/:id",
  async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const kategoriTask = await deleteKategoriTaskByProjectId(projectId);
    if (!kategoriTask) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

kategoriTaskRouter.delete("/:id", async (req: Request, res: Response) => {
  const kategoriTaskId = req.params.id;
  const kategoriTask = await deleteKategoriTaskById(kategoriTaskId);
  if (!kategoriTask) return res.sendStatus(404);
  return res.sendStatus(200);
});
