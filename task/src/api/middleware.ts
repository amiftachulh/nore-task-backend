import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { prisma } from "../db/client";

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
