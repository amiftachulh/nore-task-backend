import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import { projectSchema, ProjectSchema } from "../schema/project.schema";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} from "../service/project.service";

export const projectRouter = Router();

projectRouter.post("/", validate(projectSchema), async (req: Request, res: Response) => {
  const payload = req.body as ProjectSchema;
  const result = await createProject(payload);
  return res.status(result.code).send(result);
});

projectRouter.get("/", async (req: Request, res: Response) => {
  const result = await getAllProjects();
  return res.status(result.code).send(result);
});

projectRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getProjectById(id);
  return res.status(result.code).send(result);
});

projectRouter.patch("/:id", validate(projectSchema), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as ProjectSchema;
  const result = await updateProjectById(id, payload);
  return res.status(result.code).send(result);
});

projectRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteProjectById(id);
  return res.status(result.code).send(result);
});
