import { Router, Request, Response } from "express";
import { UserUpdate, userUpdate } from "../schema/user.schema";
import { authorize, changePasswordAuth, validate } from "./middleware";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updatePassword,
} from "../service/user.service";
import { ChangePasswordSchema, changePasswordSchema } from "../schema/auth.schema";

export const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const result = await getAllUsers();
  return res.status(result.code).send(result);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getUserById(id);
  return res.status(result.code).send(result);
});

userRouter.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordAuth(),
  async (req: Request, res: Response) => {
    const payload = req.body as ChangePasswordSchema;
    const result = await updatePassword(payload);
    return res.status(result.code).send(result);
  }
);

userRouter.patch("/:id", validate(userUpdate), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as UserUpdate;
  const result = await updateUserById(id, payload);
  return res.status(result.code).send(result);
});

userRouter.delete("/:id", authorize(["Admin"]), async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteUserById(id);
  return res.status(result.code).send(result);
});
