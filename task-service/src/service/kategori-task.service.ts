import { prisma } from "../db/client";
import { KategoriTask } from "@prisma/client";
import { BoardSchema } from "../schema/board.schema";
import {
  KategoriTaskReturn,
  KategoriTaskCreate,
  KategoriTaskUpdate,
} from "../schema/kategori-task.schema";
import config from "../config";
import axios from "axios";

export async function createKategoriTask(
  payload: KategoriTaskCreate
): Promise<KategoriTask | null> {
  try {
    await axios.get(`${config.api.main}/event/project/${payload.projectId}`);
    const kategoriTask = await prisma.kategoriTask.aggregate({
      where: { projectId: payload.projectId },
      _max: { index: true },
    });
    const index =
      kategoriTask._max.index !== null ? kategoriTask._max.index + 1 : 0;
    return await prisma.kategoriTask.create({
      data: { ...payload, index: index },
    });
  } catch (error) {
    return null;
  }
}

export const kategoriTaskReturn = {
  id: true,
  nama: true,
  projectId: true,
  index: true,
  task: true,
};

export async function getAllKategoriTasks(): Promise<
  KategoriTaskReturn[] | null
> {
  return await prisma.kategoriTask.findMany({
    select: kategoriTaskReturn,
    orderBy: { index: "asc" },
  });
}

export async function getKategoriTaskByProjectId(
  projectId: string
): Promise<KategoriTaskReturn[]> {
  return await prisma.kategoriTask.findMany({
    where: { projectId: projectId },
    select: kategoriTaskReturn,
  });
}

export async function updateKategoriTaskById(
  kategoriTaskId: string,
  payload: KategoriTaskUpdate
): Promise<KategoriTask | null> {
  try {
    return await prisma.kategoriTask.update({
      where: { id: kategoriTaskId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function swapKategoriTask(board: BoardSchema): Promise<boolean> {
  let error: any;
  const columns = board.columns;
  columns.forEach(async (column, index) => {
    try {
      await prisma.kategoriTask.update({
        where: { id: column.id },
        data: { index: index },
      });
    } catch (error) {
      error = error;
    }
  });
  if (error) return false;
  return true;
}

export async function deleteKategoriTaskById(
  kategoriTaskId: string
): Promise<KategoriTask | null> {
  try {
    return await prisma.kategoriTask.delete({
      where: { id: kategoriTaskId },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteKategoriTaskByProjectId(
  projectId: string
): Promise<boolean> {
  const kategoriTask = await prisma.kategoriTask.findFirst({
    where: { projectId: projectId },
  });
  if (!kategoriTask) return true;
  try {
    await prisma.kategoriTask.deleteMany({
      where: { projectId: projectId },
    });
    return true;
  } catch (error) {
    return false;
  }
}
