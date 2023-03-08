import { z } from "zod";
import { User, Role } from "@prisma/client";

export const userCreate = z
  .object({
    namaLengkap: z.string().min(1).max(60),
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/),
    password: z.string().min(8).max(32),
    nomorHp: z.string(),
    divisi: z.string().min(2),
  })
  .strict();

export const userUpdate = userCreate.omit({ password: true }).extend({
  password: z.string().min(8).max(32).nullish(),
  roleId: z.number().positive().gt(0).nullish(),
});

export type UserCreate = z.infer<typeof userCreate>;
export type UserUpdate = z.infer<typeof userUpdate>;
export type UserReturn = Pick<User, Exclude<keyof User, "password" | "roleId" | "refreshToken">> & {
  role: Role | null;
};
