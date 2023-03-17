import { Prisma } from "@prisma/client";
import { prisma } from "../db/client";
import { BoardSchema } from "../schema/board.schema";
import { TaskReturn, TaskSchema } from "../schema/task.schema";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createTask(payload: TaskSchema): Promise<ResponseService<null>> {
  try {
    await prisma.$transaction(async (tx) => {
      const task = await tx.task.aggregate({
        where: { kategoriTaskId: payload.kategoriTaskId },
        _max: { index: true },
      });

      const index = task._max.index !== null ? task._max.index + 1 : 0;

      await tx.task.create({
        data: { ...payload, index },
      });
    });
    return makeResponse(201, "Task berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Task gagal dibuat", null);
  }
}

const taskReturn: Prisma.TaskSelect = {
  id: true,
  nama: true,
  kategoriTask: true,
  kebutuhan: true,
  prioritas: true,
  attachment: true,
  subtask: true,
};

export async function getTaskById(taskId: string): Promise<ResponseService<TaskReturn | null>> {
  const task = (await prisma.task.findUnique({
    where: { id: taskId },
    select: taskReturn,
  })) as TaskReturn;

  if (!task) return makeResponse(404, "Task tidak ditemukan", null);
  return makeResponse(200, "Success", task);
}

export async function updateTaskById(
  taskId: string,
  payload: TaskSchema
): Promise<ResponseService<null>> {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: payload,
    });
    return makeResponse(200, "Task berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Task gagal diperbarui", null);
  }
}

export async function swapTask(board: BoardSchema): Promise<ResponseService<null>> {
  const columns = board.columns;

  try {
    await prisma.$transaction(
      columns.flatMap((column) =>
        column.cards.map((card, index) =>
          prisma.task.update({
            where: { id: card.id },
            data: { kategoriTaskId: column.id, index },
          })
        )
      )
    );
    return makeResponse(200, "Task berhasil ditukar", null);
  } catch (error) {
    return makeResponse(400, "Task gagal ditukar", null);
  }
}

export async function deleteTaskById(taskId: string): Promise<ResponseService<null>> {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return makeResponse(200, "Task berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Task gagal dihapus", null);
  }
}
