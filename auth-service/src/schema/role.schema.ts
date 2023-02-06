import { z } from "zod";

export const roleSchema = z.object({
  id: z.number().positive().gt(0),
  nama: z.string().min(1),
});

export type RoleSchema = z.infer<typeof roleSchema>;
