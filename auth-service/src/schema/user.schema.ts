import { z } from "zod";

export const userSchema = z
  .object({
    nama_lengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32),
    nomor_hp: z.string().min(10).max(15),
    divisi: z.string().min(2),
  })
  .strict();

export const userUpdateSchema = z
  .object({
    nama_lengkap: z.string().min(1).max(60),
    username: z.string().min(4).max(30),
    password: z.string().min(8).max(32).nullish(),
    nomor_hp: z.string().min(10).max(15),
    divisi: z.string().min(2),
    role_id: z.number().positive().gt(0).nullish(),
  })
  .strict();

export const userReturn = userUpdateSchema.omit({ password: true });

export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type UserReturn = z.infer<typeof userReturn>;
