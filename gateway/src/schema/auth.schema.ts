import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(4).max(30),
  password: z.string().min(8).max(32),
});

export const jwtPayloadSchema = z.object({
  id: z.string().uuid(),
});

export const changePasswordSchema = z.object({
  id: z.string().uuid(),
  password: z.string().min(8).max(32),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
