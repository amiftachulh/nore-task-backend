import { Router, Request, Response } from "express";
import { authenticate, AuthorizedRequest, validate } from "./middleware";
import { LoginSchema, loginSchema } from "../schema/auth.schema";
import { userCreate, UserCreate } from "../schema/user.schema";
import { deleteRefreshToken, login, getNewAccessToken } from "../service/auth.service";
import { register } from "../service/user.service";
import { makeResponse } from "../utils";

export const authRouter = Router();

authRouter.get("/verify", authenticate(), async (req: Request, res: Response) => {
  const user = (req as AuthorizedRequest).user;
  return res.status(200).json(makeResponse(200, "Verifikasi berhasil", user));
});

authRouter.post("/register", validate(userCreate), async (req: Request, res: Response) => {
  const payload = req.body as UserCreate;
  const result = await register(payload);
  return res.status(result.code).json(result);
});

authRouter.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  const payload = req.body as LoginSchema;
  const result = await login(payload);
  if (result.data) {
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: true,
    });
    delete result.data.refreshToken;
  }
  return res.status(result.code).json(result);
});

authRouter.get("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json(makeResponse(401, "Session Anda telah berakhir, silakan login kembali!", null));
  const result = await getNewAccessToken(refreshToken);
  return res.status(result.code).json(result);
});

authRouter.delete("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json(makeResponse(401, "Session Anda telah berakhir, silakan login kembali!", null));
  const result = await deleteRefreshToken(refreshToken);
  res.clearCookie("refreshToken");
  return res.status(result.code).json(result);
});
