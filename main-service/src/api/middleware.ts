import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { prisma } from "../db/client";
import { User } from "../types";
import axios from "axios";
import config from "../config";
import { makeResponse } from "../utils";

export function checkDbConnection() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$connect();
      return next();
    } catch (error) {
      console.log("Error: Tidak bisa terhubung ke database");
      return res.status(503).json(makeResponse(503, "Layanan tidak tersedia", null));
    }
  };
}

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).json(makeResponse(400, "Kesalahan input", error));
    }
  };
}

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(`${config.api.auth}/auth/verify`, {
        headers: {
          Authorization: req.header("Authorization"),
        },
      });
      (req as AuthorizedRequest).user = response.data.data;
      return next();
    } catch (error: any) {
      return res.status(401).json(makeResponse(401, "Token error", error.response.data.data));
    }
  };
}

export type AuthorizedRequest = Request & { user: User };

export function authorize(roleIds: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthorizedRequest).user;
    if (user.role !== null && roleIds.includes(user.role.id)) return next();
    return res.status(403).json(makeResponse(403, "Anda tidak berhak mengakses ini", null));
  };
}
