import { prisma } from "../db/client";
import { Prisma } from "@prisma/client";
import { ProjectSchema, ProjectReturn } from "../schema/project.schema";
import axios from "axios";
import config from "../config";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createProject(payload: ProjectSchema): Promise<ResponseService<null>> {
  try {
    await prisma.project.create({
      data: payload,
    });
    return makeResponse(201, "Project berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Project gagal dibuat", null);
  }
}

const projectReturn: Prisma.ProjectSelect = {
  id: true,
  nama: true,
  client: true,
  jenisLayanan: true,
  keterangan: true,
};

export async function getAllProjects(): Promise<ResponseService<ProjectReturn[] | null>> {
  const projects = (await prisma.project.findMany({
    select: projectReturn,
    orderBy: { nama: "asc" },
  })) as ProjectReturn[];

  if (!projects.length) return makeResponse(404, "Project tidak ada", null);
  return makeResponse(200, "Success", projects);
}

export async function getProjectById(
  projectId: string
): Promise<ResponseService<ProjectReturn | null>> {
  const project = (await prisma.project.findFirst({
    where: { id: projectId },
    select: projectReturn,
  })) as ProjectReturn;

  if (!project) return makeResponse(404, "Project tidak ditemukan", null);
  return makeResponse(200, "Success", project);
}

export async function updateProjectById(
  projectId: string,
  payload: ProjectSchema
): Promise<ResponseService<null>> {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: payload,
    });
    return makeResponse(200, "Project berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Project gagal diperbarui", null);
  }
}

export async function deleteProjectById(projectId: string): Promise<ResponseService<any>> {
  try {
    await axios.post(`${config.api.task}/event/delete-kategori-task`, {
      projectIds: [...projectId],
    });
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", error);
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    return makeResponse(200, "Project berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Project gagal dihapus", null);
  }
}
