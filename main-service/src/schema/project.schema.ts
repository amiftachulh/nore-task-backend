import { z } from "zod";
import { Client, Project as P } from "@prisma/client";

export const projectSchema = z.object({
  nama: z.string().min(1),
  clientId: z.string().uuid().nullable(),
  jenisLayanan: z.string().min(1),
  keterangan: z.string().nullable(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;

type Project = Omit<P, "clientId">;
export type ProjectReturn = Project & { client: Client | null };
