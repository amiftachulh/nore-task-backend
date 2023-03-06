import { prisma } from "../db/client";
import { Role } from "@prisma/client";
import { makeResponse } from "../utils";
import { ResponseService } from "../types";

export async function createRole(payload: Role): Promise<ResponseService<null>> {
  const role = await prisma.role.findFirst({
    where: {
      OR: [{ id: payload.id }, { nama: payload.nama }],
    },
  });

  if (role) return makeResponse(409, "ID atau nama role sudah ada", null);

  await prisma.role.create({
    data: payload,
  });

  return makeResponse(201, "Role berhasil dibuat", null);
}

export async function getAllRoles(): Promise<ResponseService<Role[] | null>> {
  const roles = await prisma.role.findMany({
    orderBy: { id: "asc" },
  });

  if (!roles.length) return makeResponse(404, "Role tidak ada", null);
  return makeResponse(200, "Success", roles);
}

export async function getRoleById(roleId: number): Promise<ResponseService<Role | null>> {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });

  if (!role) return makeResponse(404, "Role tidak ditemukan", null);
  return makeResponse(200, "Success", role);
}

export async function updateRoleById(
  roleId: number,
  payload: Role
): Promise<ResponseService<null>> {
  try {
    await prisma.role.update({
      where: { id: roleId },
      data: payload,
    });
    return makeResponse(200, "Role berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Role gagal diperbarui", null);
  }
}

export async function deleteRoleById(roleId: number): Promise<ResponseService<null>> {
  try {
    await prisma.role.delete({
      where: { id: roleId },
    });
    return makeResponse(200, "Role berhasil dihapus", null);
  } catch (error) {
    return makeResponse(400, "Role gagal dihapus", null);
  }
}
