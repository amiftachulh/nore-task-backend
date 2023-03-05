import { Router, Request, Response } from "express";
import { getUserById } from "../service/user.service";

export const eventRouter = Router();

eventRouter.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getUserById(id);
  return res.status(result.code).send(result);
});
