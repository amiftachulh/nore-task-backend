import { z } from "zod";

export const subtaskSchema = z
  .object({
    task_id: z.string().uuid(),
    user_id: z.string().uuid(),
    keterangan: z.string().min(1),
    poin: z.number().positive().gt(0),
  })
  .strict();

export type SubtaskSchema = z.infer<typeof subtaskSchema>;
