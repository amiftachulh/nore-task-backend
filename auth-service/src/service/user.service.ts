import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import {
  UserSchema,
  UserReturn,
  UserUpdateSchema,
} from "../schema/user.schema";
import config from "../config";
import axios from "axios";
import { ChangePasswordSchema } from "../schema/auth.schema";
import { ResponseService } from "../types";

export async function registerUser(
  payload: UserSchema
): Promise<UserReturn | null> {
  const user = await prisma.user.findMany({
    where: { username: payload.username },
  });
  if (user.length) return null;
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return (await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  })) as UserReturn;
}

export const omitUserPassword = {
  id: true,
  nama_lengkap: true,
  username: true,
  nomor_hp: true,
  divisi: true,
  role: true,
};

export async function getAllUsers(): Promise<UserReturn[] | null> {
  return await prisma.user.findMany({
    select: omitUserPassword,
  });
}

export async function getUserById(userId: string): Promise<any | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: omitUserPassword,
  });
}

export async function updateUserById(
  userId: string,
  payload: UserUpdateSchema
): Promise<UserReturn | null> {
  try {
    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      return (await prisma.user.update({
        where: { id: userId },
        data: { ...payload, password: hashedPassword },
      })) as UserReturn;
    }
    return (await prisma.user.update({
      where: { id: userId },
      data: payload,
    })) as UserReturn;
  } catch (error) {
    return null;
  }
}

export async function updatePassword(
  payload: ChangePasswordSchema
): Promise<ResponseService<any | null>> {
  const { id, currentPassword, newPassword, confirmNewPassword } = payload;
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!user)
    return {
      code: 404,
      data: null,
      err: "User not found!",
    };
  const compare = await bcrypt.compare(currentPassword, user.password);
  if (!compare)
    return {
      code: 400,
      data: null,
      err: "Wrong password!",
    };
  if (newPassword !== confirmNewPassword)
    return {
      code: 400,
      data: null,
      err: "New password didn't match",
    };
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });
    return {
      code: 200,
      data: updatedUser,
      err: null,
    };
  } catch (error) {
    return {
      code: 400,
      data: null,
      err: error,
    };
  }
}

export async function deleteUserById(
  userId: string
): Promise<UserReturn | null> {
  try {
    const user = (await prisma.user.delete({
      where: { id: userId },
    })) as UserReturn;
    await axios.patch(`${config.api.task}/event/null-user/${userId}`);
    return user;
  } catch (error) {
    return null;
  }
}
