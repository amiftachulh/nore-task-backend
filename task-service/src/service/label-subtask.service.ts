import { prisma } from "../db/client";
import { LabelSubtask } from "@prisma/client";
import {
  LabelSubtaskCreate,
  LabelSubtaskUpdate,
} from "../schema/label-subtask.schema";

export async function createLabelSubtask(
  payload: LabelSubtaskCreate
): Promise<LabelSubtask | null> {
  try {
    return await prisma.labelSubtask.create({
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function getLabelSubtaskBySubtaskId(
  subtaskId: string
): Promise<LabelSubtask[] | null> {
  const labelSubtask = await prisma.labelSubtask.findMany({
    where: { subtaskId: subtaskId },
  });
  if (!labelSubtask.length) return null;
  return labelSubtask;
}

export async function updateLabelSubtaskById(
  id: string,
  payload: LabelSubtaskUpdate
): Promise<LabelSubtask | null> {
  try {
    return await prisma.labelSubtask.update({
      where: { id: id },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteLabelSubtaskById(
  id: string
): Promise<LabelSubtask | null> {
  try {
    return await prisma.labelSubtask.delete({
      where: { id: id },
    });
  } catch (error) {
    return null;
  }
}
