import { z } from "zod";
import { KategoriTask, Task } from "@prisma/client";

export const kategoriTaskCreate = z
  .object({
    nama: z.string(),
    projectId: z.string().uuid(),
  })
  .strict();

export const kategoriTaskUpdate = z
  .object({
    nama: z.string(),
  })
  .strict();

export type KategoriTaskCreate = z.infer<typeof kategoriTaskCreate>;
export type KategoriTaskUpdate = z.infer<typeof kategoriTaskUpdate>;
export type KategoriTaskReturn = KategoriTask & { task: Task[] | null };
