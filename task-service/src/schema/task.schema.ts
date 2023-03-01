import { z } from "zod";
import { KategoriTask, Task, Subtask } from "@prisma/client";

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
export type TaskReturn = Pick<
  Task,
  Exclude<keyof Task, "kategoriTaskId" | "index">
> & { kategoriTask: KategoriTask } & {
  subtask: any;
};
