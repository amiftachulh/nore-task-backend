import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { UserCreate, UserReturn, UserUpdate } from "../schema/user.schema";
import config from "../config";
import axios from "axios";
import { ChangePasswordSchema } from "../schema/auth.schema";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function register(payload: UserCreate): Promise<ResponseService<null>> {
  const user = await prisma.user.findMany({
    where: { username: payload.username },
  });

  if (user.length) return makeResponse(409, "Username sudah diambil", null);

  await prisma.user.create({
    data: {
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
      roleId: 3,
    },
  });

  return makeResponse(201, "Berhasil mendaftar", null);
}

export const userWithoutPassword = {
  id: true,
  namaLengkap: true,
  username: true,
  nomorHp: true,
  divisi: true,
  role: true,
};

export async function getAllUsers(): Promise<ResponseService<UserReturn[] | null>> {
  const users = await prisma.user.findMany({
    select: userWithoutPassword,
  });

  if (!users.length) return makeResponse(404, "User tidak ada", null);
  return makeResponse(200, "Success", users);
}

export async function getUserById(userId: string): Promise<ResponseService<UserReturn | null>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userWithoutPassword,
  });

  if (!user) return makeResponse(404, "User tidak ditemukan", null);
  return makeResponse(200, "Success", user);
}

export async function updateUserById(
  userId: string,
  payload: UserUpdate
): Promise<ResponseService<any>> {
  try {
    const { password, ...userData } = payload;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { ...payload, password: hashedPassword },
      });

      return makeResponse(200, "User berhasil diperbarui", null);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { ...userData },
    });

    return makeResponse(200, "User berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "User gagal diperbarui", error);
  }
}

export async function updatePassword(
  userReturn: UserReturn,
  payload: ChangePasswordSchema
): Promise<ResponseService<null>> {
  const { currentPassword, newPassword, confirmNewPassword } = payload;

  const userId = userReturn.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return makeResponse(401, "User tidak ditemukan", null);

  const compare = await bcrypt.compare(currentPassword, user.password);
  if (!compare) return makeResponse(400, "Password lama yang Anda masukkan salah", null);
  if (newPassword !== confirmNewPassword)
    return makeResponse(400, "Password baru dan konfirmasi password baru tidak cocok", null);

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return makeResponse(200, "Password berhasil diganti", null);
  } catch (error) {
    return makeResponse(400, "Password gagal diganti", null);
  }
}

export async function deleteUserById(userId: string): Promise<ResponseService<null>> {
  try {
    await axios.patch(`${config.api.task}/event/null-user/${userId}`);
    await prisma.user.delete({
      where: { id: userId },
    });
    return makeResponse(200, "User berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "User gagal dihapus", null);
  }
}
