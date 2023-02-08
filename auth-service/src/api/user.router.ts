import { Router, Request, Response } from "express";
import { UserUpdateSchema, userUpdateSchema } from "../schema/user.schema";
import {
  authenticate,
  AuthorizedRequest,
  changePasswordAuth,
  validate,
} from "./middleware";
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

userRouter.get("/me", authenticate(), async (req: Request, res: Response) => {
  const user = (req as AuthorizedRequest).user;
  return res.status(200).send(user);
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
    const payload = req.body as ChangePasswordSchema;
    const user = await updatePassword(payload);
    if (user.err) return res.status(user.code).send(user.err);
    return res.status(user.code).send("Password changed");
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
