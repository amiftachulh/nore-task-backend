import { z } from "zod";
import { Task, Subtask as S } from "@prisma/client";

export const subtaskSchema = z
  .object({
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    keterangan: z.string().min(1),
    poin: z.number().positive().gt(0),
  })
  .strict();

export type SubtaskSchema = z.infer<typeof subtaskSchema>;

type Subtask = Omit<S, "taskId">;
export type SubtaskReturn = Subtask & { task: Task };
