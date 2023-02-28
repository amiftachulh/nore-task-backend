import { prisma } from "../db/client";
import { Subtask } from "@prisma/client";
import { SubtaskReturn, SubtaskSchema } from "../schema/subtask.schema";
import config from "../config";
import axios from "axios";

export async function createSubtask(
  payload: SubtaskSchema
): Promise<Subtask | null> {
  try {
    await axios.get(`${config.api.auth}/event/user/${payload.userId}`);
    return await prisma.subtask.create({
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

const subtaskReturn = {
  id: true,
  task: true,
  userId: true,
  keterangan: true,
  poin: true,
  labelSubtask: true,
};

export async function getSubtaskById(
  taskId: string
): Promise<SubtaskReturn[] | null> {
  const subtask = await prisma.subtask.findMany({
    where: { taskId: taskId },
    select: subtaskReturn,
  });
  if (!subtask.length) return null;
  return subtask;
}

export async function updateSubtaskById(
  subtaskId: string,
  payload: SubtaskSchema
): Promise<Subtask | null> {
  try {
    await axios.get(`${config.api.auth}/event/user/${payload.userId}`);
    return await prisma.subtask.update({
      where: { id: subtaskId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteSubtaskById(
  subtaskId: string
): Promise<Subtask | null> {
  try {
    return await prisma.subtask.delete({
      where: { id: subtaskId },
    });
  } catch (error) {
    return null;
  }
}

export async function setNullSubtaskByUserId(userId: string): Promise<boolean> {
  try {
    await prisma.subtask.updateMany({
      where: { userId: userId },
      data: { userId: null },
    });
    return true;
  } catch (error) {
    return false;
  }
}
