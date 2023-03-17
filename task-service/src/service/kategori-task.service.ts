import { prisma } from "../db/client";
import { BoardSchema } from "../schema/board.schema";
import {
  KategoriTaskReturn,
  KategoriTaskCreate,
  KategoriTaskUpdate,
} from "../schema/kategori-task.schema";
import config from "../config";
import axios from "axios";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";
import { Prisma } from "@prisma/client";

export async function createKategoriTask(
  payload: KategoriTaskCreate
): Promise<ResponseService<null>> {
  try {
    await axios.get(`${config.api.main}/event/project/${payload.projectId}`);
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", null);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const kategoriTask = await tx.kategoriTask.aggregate({
        where: { projectId: payload.projectId },
        _max: { index: true },
      });

      const index = kategoriTask._max.index !== null ? kategoriTask._max.index + 1 : 0;

      await tx.kategoriTask.create({
        data: { ...payload, index },
      });
    });
    return makeResponse(201, "Kategori task berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Kategori task gagal dibuat", null);
  }
}

const kategoriTaskReturn: Prisma.KategoriTaskSelect = {
  id: true,
  nama: true,
  projectId: true,
  index: true,
  task: true,
};

export async function getKategoriTaskByProjectId(
  projectId: string
): Promise<ResponseService<KategoriTaskReturn[] | null>> {
  const kategoriTask = (await prisma.kategoriTask.findMany({
    where: { projectId },
    select: kategoriTaskReturn,
  })) as KategoriTaskReturn[];

  if (!kategoriTask.length)
    return makeResponse(404, "Kategori task di project ini tidak ada", null);
  return makeResponse(200, "Success", kategoriTask);
}

export async function updateKategoriTaskById(
  id: string,
  payload: KategoriTaskUpdate
): Promise<ResponseService<null>> {
  try {
    await prisma.kategoriTask.update({
      where: { id },
      data: payload,
    });
    return makeResponse(200, "Kategori task berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Kategori task gagal diperbarui", null);
  }
}

export async function swapKategoriTask(board: BoardSchema): Promise<ResponseService<null>> {
  const columns = board.columns;

  try {
    await prisma.$transaction(
      columns.map((column, index) =>
        prisma.kategoriTask.update({
          where: { id: column.id },
          data: { index },
        })
      )
    );
    return makeResponse(200, "Kategori task berhasil ditukar", null);
  } catch (error) {
    return makeResponse(400, "Kategori task gagal ditukar", null);
  }
}

export async function deleteKategoriTaskById(id: string): Promise<ResponseService<null>> {
  try {
    await prisma.kategoriTask.delete({
      where: { id },
    });
    return makeResponse(200, "Kategori task berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Kategori task gagal dihapus", null);
  }
}

export async function deleteKategoriTaskByProjectId(
  projectIds: string[]
): Promise<ResponseService<null>> {
  await prisma.kategoriTask.deleteMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
  });

  return makeResponse(200, "Success", null);
}
