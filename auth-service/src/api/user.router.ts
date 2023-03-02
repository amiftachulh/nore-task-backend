import { Router, Request, Response } from "express";
import { UserUpdate, userUpdate } from "../schema/user.schema";
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
  if (!users) return res.status(404).send("User tidak ditemukan!");
  return res.status(200).send(users);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  if (!user) return res.status(404).send("User tidak ditemukan!");
  return res.status(200).send(user);
});

userRouter.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordAuth(),
  async (req: Request, res: Response) => {
    const payload = req.body as ChangePasswordSchema;
    const user = await updatePassword(payload);
    if (user.err) return res.status(user.code).send(user.err);
    return res.status(user.code).send("Password berhasil diganti");
  }
);

userRouter.patch(
  "/:id",
  validate(userUpdate),
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = req.body as UserUpdate;
    const user = await updateUserById(userId, payload);
    if (!user) return res.status(400).send("User gagal diupdate!");
    return res.status(200).send("User berhasil diupdate");
  }
);

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await deleteUserById(userId);
  if (!user) return res.status(400).send("User gagal dihapus!");
  return res.status(200).send("User berhasil dihapus");
});
