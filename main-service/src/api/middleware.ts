import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { prisma } from "../db/client";
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
    const header = req.header("Authorization");
    if (!header) return res.status(401).send("No authorization header found!");
    const token = header.replace("Bearer ", "");
    if (!token) return res.status(401).send("Invalid authorization header!");
    try {
      const response = await axios.get(`${config.api.auth}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      // attach user to request object
      (req as AuthorizedRequest).user = user;

      return next();
    } catch (error) {
      return res.sendStatus(401);
    }
  };
}

export type AuthorizedRequest = Request & { user: any };

export function checkIfAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthorizedRequest).user;
    if (user.role !== null && user.role.nama === "Admin") return next();
    return res.sendStatus(401);
  };
}
