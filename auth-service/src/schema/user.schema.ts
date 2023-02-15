import { z } from "zod";
import { User as U, Role } from "@prisma/client";

export const userCreate = z
  .object({
    namaLengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32),
    nomorHp: z.string().min(10).max(15),
    divisi: z.string().min(2),
  })
  .strict();

export const userUpdate = z
  .object({
    namaLengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32).nullish(),
    nomorHp: z.string().min(10).max(15),
    divisi: z.string().min(2),
    roleId: z.number().positive().gt(0).nullish(),
  })
  .strict();

export type UserCreate = z.infer<typeof userCreate>;
export type UserUpdate = z.infer<typeof userUpdate>;

type User = Omit<U, "password" | "roleId" | "refreshToken">;
export type UserReturn = User & { role: Role | null };
