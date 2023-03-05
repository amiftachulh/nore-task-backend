import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import config from "../config";
import jwt from "jsonwebtoken";
import { AnyZodObject } from "zod";
import { ChangePasswordSchema, jwtPayloadSchema } from "../schema/auth.schema";
import { UserReturn } from "../schema/user.schema";
import { makeResponse } from "../utils";

export function checkDbConnection() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$connect();
      return next();
    } catch (error) {
      console.log("Error: Tidak bisa terhubung ke database");
      return res.status(503).send(makeResponse(503, "Layanan tidak tersedia", null));
    }
  };
}

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).send(makeResponse(400, "Kesalahan input", error));
    }
  };
}

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) return res.status(401).send(makeResponse(401, "No header authorization", null));

    const token = header.replace("Bearer ", "");
    if (!token)
      return res.status(401).send(makeResponse(401, "Invalid authorization header!", null));

    try {
      const jwtPayload = jwt.verify(token, config.auth.accessToken as string);
      const verifiedPayload = await jwtPayloadSchema.parseAsync(jwtPayload);

      const user = await prisma.user.findUnique({
        where: { id: verifiedPayload.id },
        select: {
          id: true,
          namaLengkap: true,
          username: true,
          nomorHp: true,
          divisi: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).send(`User with id ${verifiedPayload.id} not found!`);
      }

      // attach user to request object
      (req as AuthorizedRequest).user = user;

      return next();
    } catch (error: any) {
      return res.status(401).send(makeResponse(401, "Token error", error));
    }
  };
}

export type AuthorizedRequest = Request & { user: UserReturn };

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthorizedRequest).user;
    if (user.role !== null && roles.includes(user.role.nama)) return next();
    return res.status(403).send(makeResponse(403, "Anda tidak berhak mengakses ini", null));
  };
}

export function changePasswordAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as ChangePasswordSchema;
    const user = (req as AuthorizedRequest).user;
    if (user.role && user.id === payload.id) return next();
    return res.sendStatus(401);
  };
}
