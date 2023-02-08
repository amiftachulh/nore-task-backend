import { Router, Request, Response } from "express";
import { getProjectById } from "../service/project.service";

export const eventRouter = Router();

eventRouter.get("/project/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const project = await getProjectById(id);
  if (!project) return res.sendStatus(404);
  return res.sendStatus(200);
});
