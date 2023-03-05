import { Router, Request, Response } from "express";
import { getProjectById } from "../service/project.service";

export const eventRouter = Router();

eventRouter.get("/project/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getProjectById(id);
  return res.status(result.code).send(result);
});
