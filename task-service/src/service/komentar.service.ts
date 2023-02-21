import { prisma } from "../db/client";
import { Komentar } from "@prisma/client";
import {
  KomentarCreate,
  KomentarReturn,
  KomentarUpdate,
} from "../schema/komentar.schema";
import { ResponseService } from "../types";
import axios from "axios";
import config from "../config";

export async function createKomentar(
  userId: string,
  payload: KomentarCreate
): Promise<ResponseService<Komentar | null>> {
  try {
    const createdAt = new Date().toISOString();
    const komentar = await prisma.komentar.create({
      data: {
        ...payload,
        userId,
        createdAt,
      },
    });
    return {
      code: 201,
      data: komentar,
      err: null,
    };
  } catch (error) {
    return {
      code: 400,
      data: null,
      err: "Komentar gagal dibuat!",
    };
  }
}

export async function getKomentarByTaskId(
  taskId: string
): Promise<ResponseService<KomentarReturn[] | null>> {
  const komentar = await prisma.komentar.findMany({
    where: { taskId: taskId },
  });
  if (!komentar.length) {
    return {
      code: 404,
      data: null,
      err: "Tidak ada komentar di task ini!",
    };
  }
  try {
    const promises = komentar.map(async k => {
      const response = await axios.get(
        `${config.api.auth}/event/user/${k.userId}`
      );
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
    return {
      code: 200,
      data: result,
      err: null,
    };
  } catch (error) {
    return {
      code: 502,
      data: null,
      err: "Tidak bisa mencapai auth service!",
    };
  }
}

export async function updateKomentarById(
  id: string,
  userId: string,
  payload: KomentarUpdate
): Promise<Komentar | null> {
  const komentar = await prisma.komentar.findUnique({
    where: { id: id },
  });
  if (!komentar) return null;
  if (userId !== komentar.userId) return null;
  try {
    const updatedAt = new Date().toISOString();
    return await prisma.komentar.update({
      where: { id: id },
      data: { ...payload, updatedAt },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteKomentarById(id: string): Promise<Komentar | null> {
  try {
    return await prisma.komentar.delete({
      where: { id: id },
    });
  } catch (error) {
    return null;
  }
}
