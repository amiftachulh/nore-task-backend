import { prisma } from "../db/client";
import { LoginSchema } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";
import { getUserById } from "./user.service";

export async function getAccess(payload: LoginSchema): Promise<any | null> {
  const user = await prisma.user.findUnique({
    where: { username: payload.username },
  });
  // check if user exists
  if (!user) return null;

  // check if passwords match
  if (!(await bcrypt.compare(payload.password, user.password))) return null;
  // if match, return jwt with user id
  const accessToken = jwt.sign(
    { id: user.id },
    config.auth.accessToken as string,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    config.auth.refreshToken as string,
    {
      algorithm: "HS256",
      expiresIn: "1d",
    }
  );
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

export async function deleteRefreshToken(
  refreshToken: string
): Promise<any | null> {
  const user = await prisma.user.findFirst({
    where: { refresh_token: refreshToken },
  });
  if (!user) return null;
  return await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: null! },
  });
}
