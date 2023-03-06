import { prisma } from "../db/client";
import { LabelTask } from "@prisma/client";
import { LabelTaskCreate, LabelTaskUpdate } from "../schema/label-task.schema";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createLabelTask(payload: LabelTaskCreate): Promise<ResponseService<null>> {
  try {
    await prisma.labelTask.create({
      data: payload,
    });
    return makeResponse(201, "Label task berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Label task gagal dibuat", null);
  }
}

export async function getLabelTaskByTaskId(
  taskId: string
): Promise<ResponseService<LabelTask[] | null>> {
  const labelTask = await prisma.labelTask.findMany({
    where: { taskId },
  });
  if (!labelTask.length) return makeResponse(404, "Tidak ada label di task ini", null);
  return makeResponse(200, "Success", labelTask);
}

export async function updateLabelTaskById(
  id: string,
  payload: LabelTaskUpdate
): Promise<ResponseService<null>> {
  try {
    await prisma.labelTask.update({
      where: { id },
      data: payload,
    });
    return makeResponse(200, "Label task berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Label task gagal diperbarui", null);
  }
}

export async function deleteLabelTaskById(id: string): Promise<ResponseService<null>> {
  try {
    await prisma.labelTask.delete({
      where: { id },
    });
    return makeResponse(200, "Label task berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Label task gagal dihapus", null);
  }
}
