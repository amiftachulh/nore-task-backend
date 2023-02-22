import { z } from "zod";

export const labelTaskCreate = z.object({
  nama: z.string().min(1).max(191),
  taskId: z.string().uuid(),
  bgColor: z.string().length(7),
  color: z.string().length(7),
});

export const labelTaskUpdate = labelTaskCreate.omit({ taskId: true });

export type LabelTaskCreate = z.infer<typeof labelTaskCreate>;
export type LabelTaskUpdate = z.infer<typeof labelTaskUpdate>;
