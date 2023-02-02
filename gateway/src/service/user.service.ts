import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { UserSchema, UserReturn } from "../schema/user.schema";
import config from "../config";
import axios from "axios";

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
  payload: UserSchema
): Promise<UserReturn | null> {
  try {
    return (await prisma.user.update({
      where: { id: userId },
      data: payload,
    })) as UserReturn;
  } catch (error) {
    return null;
  }
}

export async function updatePassword(
  userId: string,
  password: string
): Promise<any | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUserById(
  userId: string
): Promise<UserReturn | null> {
  try {
    const user = (await prisma.user.delete({
      where: { id: userId },
    })) as UserReturn;
    await axios.patch(`${config.service.task}/api/subtask/null-user/${userId}`);
    return user;
  } catch (error) {
    return null;
  }
}
