import { z } from "zod";

export const labelTaskCreate = z
  .object({
    nama: z.string().min(1).max(191),
    taskId: z.string().uuid(),
    bgColor: z.string().regex(new RegExp("^#([A-Fa-f0-9]{6})$")),
    color: z.string().regex(new RegExp("^#([A-Fa-f0-9]{6})$")),
  })
  .strict();

export const labelTaskUpdate = labelTaskCreate.omit({ taskId: true });

export type LabelTaskCreate = z.infer<typeof labelTaskCreate>;
export type LabelTaskUpdate = z.infer<typeof labelTaskUpdate>;
