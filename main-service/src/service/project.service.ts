import { prisma } from "../db/client";
import { ProjectSchema } from "../schema/project.schema";
import axios from "axios";
import config from "../config";

export async function createProject(
  payload: ProjectSchema
): Promise<ProjectSchema | null> {
  try {
    return await prisma.project.create({
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

const projectReturn = {
  id: true,
  nama: true,
  client: true,
  jenis_layanan: true,
  keterangan: true,
};

export async function getAllProjects(): Promise<any | null> {
  return await prisma.project.findMany({
    select: projectReturn,
  });
}

export async function getProjectById(projectId: string): Promise<any | null> {
  return await prisma.project.findFirst({
    where: { id: projectId },
    select: projectReturn,
  });
}

export async function updateProjectById(
  projectId: string,
  payload: ProjectSchema
): Promise<ProjectSchema | null> {
  try {
    return await prisma.project.update({
      where: { id: projectId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteProjectById(
  projectId: string
): Promise<any | null> {
  try {
    const user = await prisma.project.delete({
      where: { id: projectId },
    });
    await axios.delete(
      `${config.api.task}/event/delete-kategori-task/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${config.auth.serviceToken}`,
        },
      }
    );
    return user;
  } catch (error) {
    return null;
  }
}
