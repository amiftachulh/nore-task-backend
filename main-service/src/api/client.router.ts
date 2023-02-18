import { Router, Request, Response } from "express";
import { clientSchema, ClientSchema } from "../schema/client.schema";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
} from "../service/client.service";
import {
  checkIfAdmin,
  checkIfAdminOrProjectManager,
  validate,
} from "./middleware";

export const clientRouter = Router();

clientRouter.post(
  "/",
  validate(clientSchema),
  checkIfAdmin(),
  async (req: Request, res: Response) => {
    const payload = req.body as ClientSchema;
    const client = await createClient(payload);
    if (!client) return res.status(400).send("Client gagal dibuat!");
    return res.status(201).send("Client berhasil dibuat");
  }
);

clientRouter.get(
  "/",
  checkIfAdminOrProjectManager(),
  async (req: Request, res: Response) => {
    const clients = await getAllClients();
    if (!clients) return res.status(404).send("Client tidak ditemukan!");
    return res.status(200).send(clients);
  }
);

clientRouter.get(
  "/:id",
  checkIfAdminOrProjectManager(),
  async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const client = await getClientById(clientId);
    if (!client) return res.status(404).send("Client tidak ditemukan!");
    return res.status(200).send(client);
  }
);

clientRouter.patch(
  "/:id",
  validate(clientSchema),
  checkIfAdmin(),
  async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const payload = req.body as ClientSchema;
    const client = await updateClientById(clientId, payload);
    if (!client) return res.status(400).send("Client gagal diupdate!");
    return res.status(200).send("Client berhasil diupdate");
  }
);

clientRouter.delete(
  "/:id",
  checkIfAdmin(),
  async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const client = await deleteClientById(clientId);
    if (!client) return res.status(404).send("Client tidak ditemukan!");
    return res.status(200).send("Client berhasil dihapus");
  }
);
