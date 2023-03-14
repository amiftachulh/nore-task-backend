import { Router, Request, Response } from "express";
import { UserUpdate, userUpdate } from "../schema/user.schema";
import { authorize, AuthorizedRequest, validate } from "./middleware";
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
  return res.status(result.code).json(result);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await getUserById(id);
  return res.status(result.code).json(result);
});

userRouter.patch(
  "/change-password",
  validate(changePasswordSchema),
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const payload = req.body as ChangePasswordSchema;
    const result = await updatePassword(user, payload);
    return res.status(result.code).json(result);
  }
);

userRouter.patch("/:id", validate(userUpdate), async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as UserUpdate;
  const result = await updateUserById(id, payload);
  return res.status(result.code).json(result);
});

userRouter.delete("/:id", authorize([1]), async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await deleteUserById(id);
  return res.status(result.code).json(result);
});
