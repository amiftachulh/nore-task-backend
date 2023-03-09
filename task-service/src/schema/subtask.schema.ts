import { z } from "zod";
import { Subtask, LabelSubtask } from "@prisma/client";
import { User } from "../types";

export const subtaskSchema = z
  .object({
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    keterangan: z.string().min(1),
    poin: z.number().positive().gt(0),
  })
  .strict();

export type SubtaskSchema = z.infer<typeof subtaskSchema>;
export type SubtaskReturn = Pick<Subtask, Exclude<keyof Subtask, "userId">> & {
  user: Pick<User, "id" | "namaLengkap"> | null;
  labelSubtask: LabelSubtask[];
};
