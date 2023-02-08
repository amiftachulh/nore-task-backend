import { z } from "zod";

export const taskSchema = z
  .object({
    kategori_task_id: z.string().uuid(),
    nama: z.string().min(1),
    kebutuhan: z.string().min(1),
    prioritas: z.string(),
    attachment: z.string(),
  })
  .strict();

export type TaskSchema = z.infer<typeof taskSchema>;
