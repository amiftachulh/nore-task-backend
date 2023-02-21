import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { prisma } from "../db/client";
import { User } from "../types";

export function checkDbConnection() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$connect();
      return next();
    } catch (error) {
      console.log("Error: Tidak bisa terhubung ke database");
      return res.status(503).send({ message: "Service tidak tersedia" });
    }
  };
}

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

export function createKomentarAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("X-User");
    if (!header) return res.sendStatus(401);
    const user = JSON.parse(header) as User;
    (req as AuthorizedRequest).user = user;
    return next();
  };
}

export type AuthorizedRequest = Request & { user: User };

export function updateKomentarAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("X-User");
    if (!header) return res.sendStatus(401);
    const user = JSON.parse(header) as User;
    (req as AuthorizedRequest).user = user;
    if (user.role !== null) return next();
    return res.sendStatus(403);
  };
}

export function deleteKomentarAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("X-User");
    if (!header) return res.sendStatus(401);
    const user = JSON.parse(header) as User;
    if (
      user.role !== null &&
      (user.role.nama === "Admin" || user.id === req.body.userId)
    )
      return next();
    return res.sendStatus(403);
  };
}
