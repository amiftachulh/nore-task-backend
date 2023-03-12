import { prisma } from "../db/client";
import { LoginSchema } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function login(payload: LoginSchema): Promise<ResponseService<any>> {
  const user = await prisma.user.findUnique({
    where: { username: payload.username },
    include: { role: true },
  });

  if (!user) return makeResponse(401, "Username yang Anda masukkan salah", null);

  if (await bcrypt.compare(payload.password, user.password)) {
    const { password, roleId, refreshToken, ...userData } = user;

    const accessToken = jwt.sign(userData, config.auth.accessToken as string, {
      algorithm: "HS256",
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(userData, config.auth.refreshToken as string, {
      algorithm: "HS256",
      expiresIn: "1d",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return makeResponse(200, "Login berhasil", {
      ...userData,
      accessToken,
      refreshToken: newRefreshToken,
    });
  }

  return makeResponse(401, "Password yang Anda masukkan salah", null);
}

export async function getNewAccessToken(refreshToken: string): Promise<ResponseService<any>> {
  const user = await prisma.user.findFirst({
    where: { refreshToken },
    include: { role: true },
  });

  if (!user) return makeResponse(401, "User tidak ditemukan", null);

  const { password, roleId, refreshToken: _, ...userData } = user;

  const newAccessToken = jwt.verify(
    refreshToken,
    config.auth.refreshToken as string,
    (error): string | null => {
      if (error) return null;
      const accessToken = jwt.sign(userData, config.auth.accessToken as string, {
        algorithm: "HS256",
        expiresIn: "15m",
      });
      return accessToken;
    }
  );

  if (newAccessToken === null) return makeResponse(400, "Token baru gagal dibuat", null);

  return makeResponse(200, "Token baru berhasil diterima", {
    ...userData,
    accessToken: newAccessToken,
  });
}

export async function deleteRefreshToken(refreshToken: string): Promise<ResponseService<any>> {
  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) return makeResponse(401, "Logout gagal", null);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  return makeResponse(200, "Logout berhasil", null);
}
