import { Router, Request, Response } from "express";
import {
  userSchema,
  UserSchema,
  UserUpdateSchema,
  userUpdateSchema,
} from "../schema/user.schema";
import { changePasswordAuth, validate } from "./middleware";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updatePassword,
} from "../service/user.service";
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from "../schema/auth.schema";

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
  "/change-password",
  validate(changePasswordSchema),
  changePasswordAuth(),
  async (req: Request, res: Response) => {
    const { id, password } = req.body as ChangePasswordSchema;
    const user = await updatePassword(id, password);
    if (!user) return res.sendStatus(400);
    return res.sendStatus(200);
  }
);

userRouter.patch(
  "/:id",
  validate(userUpdateSchema),
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = req.body as UserUpdateSchema;
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