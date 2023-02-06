import { prisma } from "../db/client";
import { BoardSchema } from "../schema/board.schema";
import { TaskSchema } from "../schema/task.schema";

export async function createTask(
  payload: TaskSchema
): Promise<TaskSchema | null> {
  const task = await prisma.task.aggregate({
    where: { kategori_task_id: payload.kategori_task_id },
    _max: { index: true },
  });
  const index = task._max.index !== null ? task._max.index + 1 : 0;

  try {
    return await prisma.task.create({
      data: { ...payload, index },
    });
  } catch (error) {
    return null;
  }
}

export const taskReturn = {
  id: true,
  kategori_task: true,
  kebutuhan: true,
  prioritas: true,
  attachment: true,
  subtask: true,
};

export async function getAllTasks(): Promise<any | null> {
  return await prisma.task.findMany({
    select: taskReturn,
  });
}

export async function getTaskById(taskId: string): Promise<any | null> {
  return await prisma.task.findUnique({
    where: { id: taskId },
    select: taskReturn,
  });
}

export async function updateTaskById(
  taskId: string,
  payload: TaskSchema
): Promise<any | null> {
  try {
    return await prisma.task.update({
      where: { id: taskId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function swapTask(board: BoardSchema): Promise<boolean> {
  let error: any;
  const columns = board.columns;
  columns.forEach(column => {
    const columnId = column.id;
    column.cards.forEach(async (card, index) => {
      try {
        await prisma.task.update({
          where: { id: card.id },
          data: { kategori_task_id: columnId, index: index },
        });
      } catch (error) {
        error = error;
      }
    });
  });
  if (error) return false;
  return true;
}

export async function deleteTaskById(taskId: string): Promise<any | null> {
  try {
    return await prisma.task.delete({
      where: { id: taskId },
    });
  } catch (error) {
    return null;
  }
}
