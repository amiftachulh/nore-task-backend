import { z } from "zod";

export const boardSchema = z
  .object({
    columns: z
      .object({
        id: z.string().uuid(),
        title: z.string().min(1),
        cards: z
          .object({
            id: z.string().uuid(),
            title: z.string().min(1),
            description: z.string().min(1),
          })
          .array(),
      })
      .array(),
  })
  .strict();

export type BoardSchema = z.infer<typeof boardSchema>;
