import { prisma } from "../db/client";
import { Project } from "@prisma/client";
import { ProjectSchema, ProjectReturn } from "../schema/project.schema";
import axios from "axios";
import config from "../config";

export async function createProject(
  payload: ProjectSchema
): Promise<Project | null> {
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
  jenisLayanan: true,
  keterangan: true,
};

export async function getAllProjects(): Promise<ProjectReturn[] | null> {
  const projects = await prisma.project.findMany({
    select: projectReturn,
  });
  if (!projects.length) return null;
  return projects;
}

export async function getProjectById(
  projectId: string
): Promise<ProjectReturn | null> {
  return await prisma.project.findFirst({
    where: { id: projectId },
    select: projectReturn,
  });
}

export async function updateProjectById(
  projectId: string,
  payload: ProjectSchema
): Promise<Project | null> {
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
): Promise<Project | null> {
  try {
    await axios.delete(
      `${config.api.task}/event/delete-kategori-task/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${config.auth.serviceToken}`,
        },
      }
    );
    return await prisma.project.delete({
      where: { id: projectId },
    });
  } catch (error) {
    return null;
  }
}
