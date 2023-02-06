import { prisma } from "../db/client";
import { jwtPayloadSchema, LoginSchema } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";
import { getUserById } from "./user.service";
import { ResponseService } from "../types";

export async function getAccess(payload: LoginSchema): Promise<any | null> {
  const user = await prisma.user.findUnique({
    where: { username: payload.username },
  });
  // check if user exists
  if (!user) return null;

  // check if passwords match
  if (!(await bcrypt.compare(payload.password, user.password))) return null;
  // if match, return jwt with user id
  const { password, refresh_token, id, ...userData } = user;
  const accessToken = jwt.sign({ id }, config.auth.accessToken as string, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id }, config.auth.refreshToken as string, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: refreshToken },
  });
  const userWithoutPassword = await getUserById(user.id);

  return { ...userWithoutPassword, accessToken, refreshToken };
}

export async function getNewAccessToken(
  refreshToken: string
): Promise<any | null> {
  const user = await prisma.user.findFirst({
    where: { refresh_token: refreshToken },
  });
  if (!user) return null;
  const newAccessToken = jwt.verify(
    refreshToken,
    config.auth.refreshToken as string,
    error => {
      if (error) return null;
      const accessToken = jwt.sign(
        { id: user.id },
        config.auth.accessToken as string,
        {
          algorithm: "HS256",
          expiresIn: "15m",
        }
      );
      return accessToken;
    }
  );
  return newAccessToken;
}

export async function verifyToken(
  accessToken: string
): Promise<ResponseService<any | null>> {
  try {
    const jwtPayload = jwt.verify(
      accessToken,
      config.auth.accessToken as string
    );
    const verifiedPayload = await jwtPayloadSchema.parseAsync(jwtPayload);
    const user = await prisma.user.findUnique({
      where: { id: verifiedPayload.id },
      select: {
        id: true,
        nama_lengkap: true,
        username: true,
        nomor_hp: true,
        divisi: true,
        role: true,
      },
    });
    if (!user)
      return {
        code: 404,
        data: null,
        err: "User not found.",
      };
    return {
      code: 200,
      data: user,
      err: null,
    };
  } catch (error) {
    return {
      code: 401,
      data: null,
      err: error,
    };
  }
}

export async function deleteRefreshToken(
  refreshToken: string
): Promise<any | null> {
  const user = await prisma.user.findFirst({
    where: { refresh_token: refreshToken },
  });
  if (!user) return null;
  return await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: null },
  });
}
