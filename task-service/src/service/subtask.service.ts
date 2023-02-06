import { prisma } from "../db/client";
import { SubtaskSchema } from "../schema/subtask.schema";
import config from "../config";
import axios from "axios";

export async function createSubtask(
  payload: SubtaskSchema
): Promise<SubtaskSchema | null> {
  try {
    await axios.get(`${config.api.auth}/user/${payload.user_id}`, {
      headers: {
        Authorization: `Bearer ${config.auth.serviceToken}`,
      },
    });
    return (await prisma.subtask.create({
      data: payload,
    })) as SubtaskSchema;
  } catch (error) {
    return null;
  }
}

const subtaskReturn = {
  id: true,
  task: true,
  user_id: true,
  keterangan: true,
  poin: true,
};

export async function getAllSubtasks(): Promise<any | null> {
  return await prisma.subtask.findMany({
    select: subtaskReturn,
  });
}

export async function getSubtaskById(subtaskId: string): Promise<any | null> {
  return await prisma.subtask.findUnique({
    where: { id: subtaskId },
    select: subtaskReturn,
  });
}

export async function updateSubtaskById(
  subtaskId: string,
  payload: SubtaskSchema
): Promise<SubtaskSchema | null> {
  try {
    await axios.get(`${config.api.auth}/user/${payload.user_id}`, {
      headers: {
        Authorization: `Bearer ${config.auth.serviceToken}`,
      },
    });
    return (await prisma.subtask.update({
      where: { id: subtaskId },
      data: payload,
    })) as SubtaskSchema;
  } catch (error) {
    return null;
  }
}

export async function deleteSubtaskById(
  subtaskId: string
): Promise<SubtaskSchema | null> {
  try {
    return (await prisma.subtask.delete({
      where: { id: subtaskId },
    })) as SubtaskSchema;
  } catch (error) {
    return null;
  }
}

export async function setNullSubtaskByUserId(userId: string): Promise<boolean> {
  try {
    await prisma.subtask.updateMany({
      where: { user_id: userId },
      data: { user_id: null },
    });
    return true;
  } catch (error) {
    return false;
  }
}
