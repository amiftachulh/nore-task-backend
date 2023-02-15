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

roleRouter.post(
  "/",
  validate(roleSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as Role;
    const role = await createRole(payload);
    if (!role) return res.status(409).send("ID atau Nama Role sudah ada!");
    return res.sendStatus(201);
  }
);

roleRouter.get("/", async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  if (!roles) return res.sendStatus(404);
  return res.status(200).send(roles);
});

roleRouter.get("/:id", async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  const role = await getRoleById(roleId);
  if (!role) return res.sendStatus(404);
  return res.status(200).send(role);
});

roleRouter.patch(
  "/:id",
  validate(roleSchema),
  async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);
    const payload = req.body as Role;
    const role = await updateRoleById(roleId, payload);
    if (!role) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);

roleRouter.delete("/:id", async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  const role = await deleteRoleById(roleId);
  if (!role) return res.sendStatus(404);
  return res.sendStatus(200);
});
