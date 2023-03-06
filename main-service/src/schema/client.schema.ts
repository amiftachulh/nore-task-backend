import { z } from "zod";

export const clientSchema = z
  .object({
    nama: z.string().min(1).max(60),
    perusahaan: z.string().nullable(),
    alamat: z.string().nullable(),
    nomorHp: z.string().min(10).max(15),
  })
  .strict();

export type ClientSchema = z.infer<typeof clientSchema>;
