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

projectRouter.post(
  "/",
  validate(projectSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as ProjectSchema;
    const project = await createProject(payload);
    if (!project) return res.sendStatus(400);
    return res.sendStatus(201);
  }
);

projectRouter.get("/", async (req: Request, res: Response) => {
  const projects = await getAllProjects();
  if (!projects) return res.sendStatus(404);
  return res.status(200).send(projects);
});

projectRouter.get("/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = await getProjectById(projectId);
  if (!project) return res.sendStatus(404);
  return res.status(200).send(project);
});

projectRouter.patch(
  "/:id",
  validate(projectSchema),
  async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const payload = req.body as ProjectSchema;
    const project = await updateProjectById(projectId, payload);
    if (!project) return res.sendStatus(404);
    return res.sendStatus(200);
  }
);

projectRouter.delete("/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = await deleteProjectById(projectId);
  if (!project) return res.sendStatus(404);
  return res.sendStatus(200);
});
