import { z } from "zod";

export const projectSchema = z.object({
  nama: z.string().min(1),
  client_id: z.string().uuid().nullable(),
  jenis_layanan: z.string().min(1),
  keterangan: z.string().nullable(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
