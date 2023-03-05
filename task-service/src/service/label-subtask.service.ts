import { prisma } from "../db/client";
import { LabelSubtask } from "@prisma/client";
import { LabelSubtaskCreate, LabelSubtaskUpdate } from "../schema/label-subtask.schema";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createLabelSubtask(
  payload: LabelSubtaskCreate
): Promise<ResponseService<null>> {
  try {
    await prisma.labelSubtask.create({
      data: payload,
    });
    return makeResponse(201, "Label subtask berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Label subtask gagal dibuat", null);
  }
}

export async function getLabelSubtaskBySubtaskId(
  subtaskId: string
): Promise<ResponseService<LabelSubtask[] | null>> {
  const labelSubtask = await prisma.labelSubtask.findMany({
    where: { subtaskId },
  });
  if (!labelSubtask.length) return makeResponse(404, "Tidak ada label di subtask ini", null);
  return makeResponse(200, "Success", labelSubtask);
}

export async function updateLabelSubtaskById(
  id: string,
  payload: LabelSubtaskUpdate
): Promise<ResponseService<null>> {
  try {
    await prisma.labelSubtask.update({
      where: { id },
      data: payload,
    });
    return makeResponse(200, "Label subtask berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Label subtask gagal diperbarui", null);
  }
}

export async function deleteLabelSubtaskById(id: string): Promise<ResponseService<null>> {
  try {
    await prisma.labelSubtask.delete({
      where: { id },
    });
    return makeResponse(200, "Label subtask berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Label subtask gagal dihapus", null);
  }
}
