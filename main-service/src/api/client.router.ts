import { Router, Request, Response } from "express";
import { clientSchema, ClientSchema } from "../schema/client.schema";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
} from "../service/client.service";
import { validate } from "./middleware";

export const clientRouter = Router();

clientRouter.post(
  "/",
  validate(clientSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as ClientSchema;
    const client = await createClient(payload);
    if (!client) return res.sendStatus(400);
    return res.sendStatus(201);
  }
);

clientRouter.get("/", async (req: Request, res: Response) => {
  const clients = await getAllClients();
  if (!clients) return res.sendStatus(404);
  return res.status(200).send(clients);
});

clientRouter.get("/:id", async (req: Request, res: Response) => {
  const clientId = req.params.id;
  const client = await getClientById(clientId);
  if (!client) return res.sendStatus(404);
  return res.status(200).send(client);
});

clientRouter.patch(
  "/:id",
  validate(clientSchema),
  async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const payload = req.body as ClientSchema;
    const client = await updateClientById(clientId, payload);
    if (!client) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

clientRouter.delete("/:id", async (req: Request, res: Response) => {
  const clientId = req.params.id;
  const client = await deleteClientById(clientId);
  if (!client) return res.sendStatus(404);
  return res.sendStatus(200);
});
