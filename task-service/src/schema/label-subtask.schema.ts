import { z } from "zod";

export const labelSubtaskCreate = z
  .object({
    nama: z.string().min(1).max(191),
    subtaskId: z.string().uuid(),
    bgColor: z.string().regex(/^#([a-fA-F0-9]{6})$/),
    color: z.string().regex(/^#([a-fA-F0-9]{6})$/),
  })
  .strict();

export const labelSubtaskUpdate = labelSubtaskCreate.omit({ subtaskId: true });

export type LabelSubtaskCreate = z.infer<typeof labelSubtaskCreate>;
export type LabelSubtaskUpdate = z.infer<typeof labelSubtaskUpdate>;
