import { z } from "zod";
import { KategoriTask, Task as T, Subtask } from "@prisma/client";

export const taskSchema = z
  .object({
    kategoriTaskId: z.string().uuid(),
    nama: z.string().min(1),
    kebutuhan: z.string().min(1),
    prioritas: z.string(),
    attachment: z.string(),
  })
  .strict();

export type TaskSchema = z.infer<typeof taskSchema>;

type Task = Omit<T, "kategoriTaskId" | "index">;
export type TaskReturn = Task & { kategoriTask: KategoriTask } & {
  subtask: any;
};
