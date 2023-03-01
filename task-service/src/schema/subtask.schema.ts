import { z } from "zod";
import { Task, Subtask, LabelSubtask } from "@prisma/client";

export const subtaskSchema = z
  .object({
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    keterangan: z.string().min(1),
    poin: z.number().positive().gt(0),
  })
  .strict();

export type SubtaskSchema = z.infer<typeof subtaskSchema>;
export type SubtaskReturn = Pick<Subtask, Exclude<keyof Subtask, "taskId">> & {
  task: Task;
  labelSubtask: LabelSubtask[];
};
