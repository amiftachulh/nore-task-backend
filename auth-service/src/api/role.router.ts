import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import { roleSchema } from "../schema/role.schema";
import { Role } from "@prisma/client";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} from "../service/role.service";

export const roleRouter = Router();

roleRouter.post("/", validate(roleSchema), async (req: Request, res: Response) => {
  const payload = req.body as Role;
  const result = await createRole(payload);
  return res.status(result.code).send(result);
});

roleRouter.get("/", async (req: Request, res: Response) => {
  const result = await getAllRoles();
  return res.status(result.code).send(result);
});

roleRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await getRoleById(id);
  return res.status(result.code).send(result);
});

roleRouter.patch("/:id", validate(roleSchema), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const payload = req.body as Role;
  const result = await updateRoleById(id, payload);
  return res.status(result.code).send(result);
});

roleRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await deleteRoleById(id);
  return res.status(result.code).send(result);
});
