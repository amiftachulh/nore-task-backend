import { z } from "zod";

export const kategoriTaskSchema = z.object({
  nama: z.string(),
  project_id: z.string().uuid(),
});

export const kategoriTaskUpdate = z.object({
  nama: z.string(),
});

export type KategoriTaskSchema = z.infer<typeof kategoriTaskSchema>;
export type KategoriTaskUpdate = z.infer<typeof kategoriTaskUpdate>;
