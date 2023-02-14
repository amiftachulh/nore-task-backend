import { Router, Request, Response } from "express";
import { authenticate, AuthorizedRequest, validate } from "./middleware";
import { LoginSchema, loginSchema } from "../schema/auth.schema";
import { userCreate, UserCreate } from "../schema/user.schema";
import {
  deleteRefreshToken,
  getAccess,
  getNewAccessToken,
} from "../service/auth.service";
import { registerUser } from "../service/user.service";

export const authRouter = Router();

authRouter.get("/", authenticate(), async (req: Request, res: Response) => {
  const user = (req as AuthorizedRequest).user;
  return res.status(200).send(user);
});

authRouter.post(
  "/register",
  validate(userCreate),
  async (req: Request, res: Response) => {
    const payload = req.body as UserCreate;
    const user = await registerUser(payload);
    if (!user) return res.status(409).send("Username sudah diambil!");
    return res.sendStatus(201);
  }
);

authRouter.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as LoginSchema;
    const user = await getAccess(payload);
    if (!user) return res.sendStatus(401);
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    delete user.refreshToken;
    return res.status(200).send(user);
  }
);

authRouter.get("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const user = await getNewAccessToken(refreshToken);
  if (!user) return res.sendStatus(403);
  return res.status(200).send(user);
});

authRouter.delete("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(400);
  const user = await deleteRefreshToken(refreshToken);
  res.clearCookie("refreshToken");
  if (!user) return res.sendStatus(404);
  return res.sendStatus(200);
});
