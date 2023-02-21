import { z } from "zod";

export const labelTaskCreate = z.object({
  nama: z.string().min(1).max(191),
  taskId: z.string().uuid(),
});

export const labelTaskUpdate = labelTaskCreate.omit({ taskId: true });

export type LabelTaskCreate = z.infer<typeof labelTaskCreate>;
export type LabelTaskUpdate = z.infer<typeof labelTaskUpdate>;
