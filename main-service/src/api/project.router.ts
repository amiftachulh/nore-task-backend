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
    if (!project) return res.status(400).send("Project gagal dibuat!");
    return res.status(201).send("Project berhasil dibuat");
  }
);

projectRouter.get("/", async (req: Request, res: Response) => {
  const projects = await getAllProjects();
  if (!projects) return res.status(404).send("Project tidak ditemukan!");
  return res.status(200).send(projects);
});

projectRouter.get("/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = await getProjectById(projectId);
  if (!project) return res.status(404).send("Project tidak ditemukan!");
  return res.status(200).send(project);
});

projectRouter.patch(
  "/:id",
  validate(projectSchema),
  async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const payload = req.body as ProjectSchema;
    const project = await updateProjectById(projectId, payload);
    if (!project) return res.status(400).send("Project gagal diupdate!");
    return res.status(200).send("Project berhasil diupdate");
  }
);

projectRouter.delete("/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = await deleteProjectById(projectId);
  if (!project) return res.status(400).send("Project gagal dihapus!");
  return res.status(200).send("Project berhasil dihapus");
});
