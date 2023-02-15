import { prisma } from "../db/client";
import { jwtPayloadSchema, LoginSchema } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";

export async function getAccess(payload: LoginSchema): Promise<any | null> {
  const user = await prisma.user.findUnique({
    where: { username: payload.username },
    include: { role: true },
  });
  // check if user exists
  if (!user) return null;

  // check if passwords match
  if (await bcrypt.compare(payload.password, user.password)) {
    // if match, return jwt with user id
    const { id, password, roleId, refreshToken, ...userData } = user;
    const accessToken = jwt.sign({ id }, config.auth.accessToken as string, {
      algorithm: "HS256",
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
      { id },
      config.auth.refreshToken as string,
      {
        algorithm: "HS256",
        expiresIn: "1d",
      }
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { id, ...userData, accessToken, refreshToken: newRefreshToken };
  }
  return null;
}

export async function getNewAccessToken(
  refreshToken: string
): Promise<any | null> {
  const user = await prisma.user.findFirst({
    where: { refreshToken: refreshToken },
    include: { role: true },
  });
  if (!user) return null;
  const { password, refreshToken: _, roleId, ...userData } = user;
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
  return { ...userData, accessToken: newAccessToken };
}

export async function deleteRefreshToken(
  refreshToken: string
): Promise<any | null> {
  const user = await prisma.user.findFirst({
    where: { refreshToken: refreshToken },
  });
  if (!user) return null;
  return await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });
}
