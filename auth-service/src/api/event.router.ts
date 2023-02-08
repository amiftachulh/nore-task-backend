import { Router, Request, Response } from "express";
import { getUserById } from "../service/user.service";

export const eventRouter = Router();

eventRouter.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await getUserById(id);
  if (!user) return res.sendStatus(404);
  return res.sendStatus(200);
});
