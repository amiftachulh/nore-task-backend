import { Router, Request, Response } from "express";
import { userSchema, UserSchema } from "../schema/user.schema";
import { validate } from "./middleware";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../service/user.service";

export const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  if (!users) return res.sendStatus(404);
  return res.status(200).send(users);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  if (!user) return res.sendStatus(404);
  return res.status(200).send(user);
});

userRouter.patch(
  "/:id",
  validate(userSchema),
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = req.body as UserSchema;
    const user = await updateUserById(userId, payload);
    if (!user) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await deleteUserById(userId);
  if (!user) return res.sendStatus(404);
  return res.sendStatus(200);
});
