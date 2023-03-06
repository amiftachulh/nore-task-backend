import { prisma } from "../db/client";
import { Komentar } from "@prisma/client";
import { KomentarCreate, KomentarReturn, KomentarUpdate } from "../schema/komentar.schema";
import { ResponseService, User } from "../types";
import axios from "axios";
import config from "../config";
import { makeResponse } from "../utils";

export async function createKomentar(
  userId: string,
  payload: KomentarCreate
): Promise<ResponseService<null>> {
  try {
    await prisma.komentar.create({
      data: {
        ...payload,
        userId,
        createdAt: new Date().toISOString(),
      },
    });
    return makeResponse(201, "Komentar berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Komentar gagal dibuat", null);
  }
}

export async function getKomentarByTaskId(
  taskId: string
): Promise<ResponseService<KomentarReturn[] | null>> {
  const komentar = await prisma.komentar.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
  });

  if (!komentar.length) return makeResponse(404, "Tidak ada komentar di task ini", null);

  try {
    const promises = komentar.map(async (k) => {
      const response = await axios.get(`${config.api.auth}/event/user/${k.userId}`);
      const { userId, ...data } = k;
      return {
        ...data,
        user: {
          id: response.data.id,
          namaLengkap: response.data.namaLengkap,
        },
      };
    });
    const result = await Promise.all(promises);
    return makeResponse(200, "Success", result);
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", null);
  }
}

export async function updateKomentarById(
  id: string,
  userId: string,
  payload: KomentarUpdate
): Promise<ResponseService<null>> {
  const komentar = await prisma.komentar.findUnique({
    where: { id },
  });

  if (!komentar) return makeResponse(404, "Komentar tidak ditemukan", null);
  if (userId !== komentar.userId)
    return makeResponse(401, "Anda tidak bisa mengedit komentar ini", null);

  try {
    await prisma.komentar.update({
      where: { id: id },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
    return makeResponse(200, "Komentar berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Komentar gagal diperbarui", null);
  }
}

export async function deleteKomentarById(id: string, user: User): Promise<ResponseService<null>> {
  const komentar = await prisma.komentar.findUnique({
    where: { id },
  });

  if (!komentar) return makeResponse(404, "Komentar tidak ditemukan", null);

  if (user.role?.nama === "Admin" || user.id === komentar.userId) {
    try {
      await prisma.komentar.delete({
        where: { id },
      });
      return makeResponse(200, "Komentar berhasil dihapus", null);
    } catch (error) {
      return makeResponse(400, "Komentar gagal dihapus", null);
    }
  }
  return makeResponse(401, "Anda tidak bisa menghapus komentar ini", null);
}
