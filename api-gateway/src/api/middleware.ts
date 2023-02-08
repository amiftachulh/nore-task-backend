import { Request, Response, NextFunction } from "express";
import config from "../config";
import axios from "axios";

export function authenticate(auth: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!auth) return next();
    const header = req.header("Authorization");
    if (!header) return res.status(401).send("No authorization header found!");
    const token = header.replace("Bearer ", "");
    if (!token) return res.status(401).send("Invalid authorization header!");
    try {
      const response = await axios.get(`${config.service.auth}/api/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      (req as AuthorizedRequest).user = user;
      return next();
    } catch (error) {
      return res.status(401).send(error);
    }
  };
}

export type AuthorizedRequest = Request & { user: any };
