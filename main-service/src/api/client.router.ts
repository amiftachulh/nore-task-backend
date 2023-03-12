import { Router, Request, Response } from "express";
import { clientSchema, ClientSchema } from "../schema/client.schema";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
} from "../service/client.service";
import { authorize, validate } from "./middleware";

export const clientRouter = Router();

clientRouter.post(
  "/",
  validate(clientSchema),
  authorize(["Admin"]),
  async (req: Request, res: Response) => {
    const payload = req.body as ClientSchema;
    const result = await createClient(payload);
    return res.status(result.code).json(result);
  }
);

clientRouter.get(
  "/",
  authorize(["Admin", "Project Manager"]),
  async (req: Request, res: Response) => {
    const result = await getAllClients();
    return res.status(result.code).json(result);
  }
);

clientRouter.get(
  "/:id",
  authorize(["Admin", "Project Manager"]),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await getClientById(id);
    return res.status(result.code).json(result);
  }
);

clientRouter.patch(
  "/:id",
  validate(clientSchema),
  authorize(["Admin"]),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as ClientSchema;
    const result = await updateClientById(id, payload);
    return res.status(result.code).json(result);
  }
);

clientRouter.delete("/:id", authorize(["Admin"]), async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteClientById(id);
  return res.status(result.code).json(result);
});
