import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import config from "../config";
import jwt from "jsonwebtoken";
import { AnyZodObject } from "zod";
import { jwtPayloadSchema } from "../schema/auth.schema";

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

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.hostname);
      // extract token from header
      const header = req.header("Authorization");
      if (!header)
        return res.status(401).send("No authorization header found!");
      const token = header.replace("Bearer ", "");
      if (token === config.auth.serviceToken) return next();
      if (!token) return res.status(401).send("Invalid authorization header!");

      // verify and decode jwt token
      const jwtPayload = jwt.verify(token, config.auth.accessToken as string);
      const verifiedPayload = await jwtPayloadSchema.parseAsync(jwtPayload);

      // get user from db
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
      if (!user) {
        return res
          .status(404)
          .send(`User with id ${verifiedPayload.id} not found!`);
      }

      // attach user to request object
      (req as AuthorizedRequest).user = user;

      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

export type AuthorizedRequest = Request & { user: any };

export function checkIfAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthorizedRequest).user;
    if (user.role_id !== null && user.role.nama === "Admin") return next();
    return res.sendStatus(401);
  };
}

export function checkIfAdminOrProjectManager() {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthorizedRequest).user;
    if (
      user.role_id !== null &&
      (user.role.nama === "Admin" || user.role.nama === "Project Manager")
    )
      return next();
    return res.sendStatus(401);
  };
}