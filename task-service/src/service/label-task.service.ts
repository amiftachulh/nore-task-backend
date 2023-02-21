import { prisma } from "../db/client";
import { LabelTask } from "@prisma/client";
import { LabelTaskCreate, LabelTaskUpdate } from "../schema/label-task.schema";

export async function createLabelTask(
  payload: LabelTaskCreate
): Promise<LabelTask | null> {
  try {
    return await prisma.labelTask.create({
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function getLabelTaskByTaskId(
  taskId: string
): Promise<LabelTask[] | null> {
  const labelTask = await prisma.labelTask.findMany({
    where: { taskId: taskId },
  });
  if (!labelTask.length) return null;
  return labelTask;
}

export async function updateLabelTaskById(
  id: string,
  payload: LabelTaskUpdate
): Promise<LabelTask | null> {
  try {
    return await prisma.labelTask.update({
      where: { id: id },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteLabelTaskById(
  id: string
): Promise<LabelTask | null> {
  try {
    return await prisma.labelTask.delete({
      where: { id: id },
    });
  } catch (error) {
    return null;
  }
}
