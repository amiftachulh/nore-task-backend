import { z } from "zod";
import { user, role } from "@prisma/client";

export const userCreate = z
  .object({
    nama_lengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32),
    nomor_hp: z.string().min(10).max(15),
    divisi: z.string().min(2),
  })
  .strict();

export const userUpdate = z
  .object({
    nama_lengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32).nullish(),
    nomor_hp: z.string().min(10).max(15),
    divisi: z.string().min(2),
    role_id: z.number().positive().gt(0).nullish(),
  })
  .strict();

export type UserCreate = z.infer<typeof userCreate>;
export type UserUpdate = z.infer<typeof userUpdate>;

type UserWithoutPassword = Omit<user, "password" | "role_id" | "refresh_token">;
export type UserReturn = UserWithoutPassword & {
  role: role | null;
};
