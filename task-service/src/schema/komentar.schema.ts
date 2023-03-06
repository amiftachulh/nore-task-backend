import { z } from "zod";
import { Komentar } from "@prisma/client";

export const komentarCreate = z
  .object({
    taskId: z.string().uuid(),
    konten: z.string().min(1).max(500),
  })
  .strict();

export const komentarUpdate = komentarCreate.omit({ taskId: true });

export type KomentarCreate = z.infer<typeof komentarCreate>;
export type KomentarUpdate = z.infer<typeof komentarUpdate>;
export type KomentarReturn = Pick<
  Komentar,
  Exclude<keyof Komentar, "userId">
> & {
  user: {
    id: string;
    namaLengkap: string;
  };
};
