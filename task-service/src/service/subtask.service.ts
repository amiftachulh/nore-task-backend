import { prisma } from "../db/client";
import { SubtaskReturn, SubtaskSchema } from "../schema/subtask.schema";
import config from "../config";
import axios from "axios";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createSubtask(payload: SubtaskSchema): Promise<ResponseService<null>> {
  try {
    await axios.get(`${config.api.auth}/event/user/${payload.userId}`);
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", null);
  }

  try {
    await prisma.subtask.create({
      data: payload,
    });
    return makeResponse(201, "Subtask berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Subtask gagal dibuat", null);
  }
}

const subtaskReturn = {
  id: true,
  task: true,
  userId: true,
  keterangan: true,
  poin: true,
  labelSubtask: true,
};

export async function getSubtaskById(
  taskId: string
): Promise<ResponseService<SubtaskReturn[] | null>> {
  const subtask = await prisma.subtask.findMany({
    where: { taskId },
    include: { labelSubtask: true },
  });

  if (!subtask.length) return makeResponse(400, "Subtask tidak ditemukan", null);

  const promises = subtask.map(async (st) => {
    try {
      const response = await axios.get(`${config.api.auth}/event/user/${st.userId}`);
      const { userId, ...data } = st;
      return {
        ...data,
        user: {
          id: response.data.data.id,
          namaLengkap: response.data.data.namaLengkap,
        },
      };
    } catch (error) {
      const { userId, ...data } = st;
      return {
        ...data,
        user: null,
      };
    }
  });
  const result = await Promise.all(promises);
  return makeResponse(200, "Success", result);
}

export async function updateSubtaskById(
  subtaskId: string,
  payload: SubtaskSchema
): Promise<ResponseService<null>> {
  try {
    await axios.get(`${config.api.auth}/event/user/${payload.userId}`);
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", null);
  }

  try {
    await prisma.subtask.update({
      where: { id: subtaskId },
      data: payload,
    });
    return makeResponse(200, "Subtask berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Subtask gagal diperbarui", null);
  }
}

export async function deleteSubtaskById(subtaskId: string): Promise<ResponseService<null>> {
  try {
    await prisma.subtask.delete({
      where: { id: subtaskId },
    });
    return makeResponse(200, "Subtask berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Subtask gagal dihapus", null);
  }
}

export async function setNullSubtaskByUserId(userId: string): Promise<boolean> {
  try {
    await prisma.subtask.updateMany({
      where: { userId },
      data: { userId: null },
    });
    return true;
  } catch (error) {
    return false;
  }
}
