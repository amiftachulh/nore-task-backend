import { z } from "zod";
import { Komentar as K } from "@prisma/client";

export const komentarCreate = z
  .object({
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    konten: z.string().min(1).max(500),
  })
  .strict();

export const komentarUpdate = komentarCreate.omit({ taskId: true });

export type KomentarCreate = z.infer<typeof komentarCreate>;
export type KomentarUpdate = z.infer<typeof komentarUpdate>;

type Komentar = Omit<K, "userId">;
export type KomentarReturn = Komentar & {
  user: {
    id: string;
    namaLengkap: string;
  };
};
