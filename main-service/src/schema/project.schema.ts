import { z } from "zod";
import { Client, Project } from "@prisma/client";

export const projectSchema = z
  .object({
    nama: z.string().min(1),
    clientId: z.string().uuid().nullable(),
    jenisLayanan: z.string().min(1),
    keterangan: z.string().nullable(),
  })
  .strict();

export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectReturn = Pick<Project, Exclude<keyof Project, "clientId">> & {
  client: Client | null;
};
