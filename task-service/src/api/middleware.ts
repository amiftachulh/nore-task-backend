import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { prisma } from "../db/client";
import { User } from "../types";
import axios from "axios";
import config from "../config";

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
      const response = await axios.get(`${config.api.auth}/auth/verify`, {
        headers: {
          Authorization: req.header("Authorization"),
        },
      });
      (req as AuthorizedRequest).user = response.data;
      return next();
    } catch (error) {
      return res.sendStatus(401);
    }
  };
}

export type AuthorizedRequest = Request & { user: User };
