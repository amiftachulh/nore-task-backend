import { prisma } from "../db/client";
import { BoardSchema } from "../schema/board.schema";
import {
  KategoriTaskSchema,
  KategoriTaskUpdate,
} from "../schema/kategori-task.schema";
import config from "../config";
import axios from "axios";

export async function createKategoriTask(
  payload: KategoriTaskSchema
): Promise<KategoriTaskSchema | null> {
  try {
    await axios.get(`${config.api.main}/project/${payload.project_id}`, {
      headers: {
        Authorization: `Bearer ${config.auth.serviceToken}`,
      },
    });
    const kategoriTask = await prisma.kategori_task.aggregate({
      where: { project_id: payload.project_id },
      _max: { index: true },
    });
    const index =
      kategoriTask._max.index !== null ? kategoriTask._max.index + 1 : 0;
    return await prisma.kategori_task.create({
      data: { ...payload, index: index },
    });
  } catch (error) {
    return null;
  }
}

export const kategoriTaskReturn = {
  id: true,
  nama: true,
  project_id: true,
  index: true,
  task: true,
};

export async function getAllKategoriTasks(): Promise<any | null> {
  return await prisma.kategori_task.findMany({
    select: kategoriTaskReturn,
    orderBy: { index: "asc" },
  });
}

export async function getKategoriTaskById(
  kategori_taskId: string
): Promise<any | null> {
  return await prisma.kategori_task.findUnique({
    where: { id: kategori_taskId },
    select: kategoriTaskReturn,
  });
}

export async function updateKategoriTaskById(
  kategoriTaskId: string,
  payload: KategoriTaskUpdate
): Promise<KategoriTaskSchema | null> {
  try {
    return await prisma.kategori_task.update({
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
      await prisma.kategori_task.update({
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
  kategori_taskId: string
): Promise<KategoriTaskSchema | null> {
  try {
    return await prisma.kategori_task.delete({
      where: { id: kategori_taskId },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteKategoriTaskByProjectId(
  projectId: string
): Promise<boolean> {
  try {
    await prisma.kategori_task.deleteMany({
      where: { project_id: projectId },
    });
    return true;
  } catch (error) {
    return false;
  }
}
