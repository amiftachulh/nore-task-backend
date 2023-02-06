import { prisma } from "../db/client";
import { RoleSchema } from "../schema/role.schema";

export async function createRole(
  payload: RoleSchema
): Promise<RoleSchema | null> {
  const roleId = await getRoleById(payload.id);
  const roleNama = await prisma.role.findUnique({
    where: { nama: payload.nama },
  });
  if (roleId || roleNama) return null;
  return await prisma.role.create({
    data: payload,
  });
}

export async function getAllRoles(): Promise<RoleSchema[] | null> {
  return await prisma.role.findMany({
    orderBy: { id: "asc" },
  });
}

export async function getRoleById(roleId: number): Promise<RoleSchema | null> {
  return await prisma.role.findUnique({
    where: { id: roleId },
  });
}

export async function updateRoleById(
  roleId: number,
  payload: RoleSchema
): Promise<RoleSchema | null> {
  try {
    return await prisma.role.update({
      where: { id: roleId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteRoleById(
  roleId: number
): Promise<RoleSchema | null> {
  try {
    return await prisma.role.delete({
      where: { id: roleId },
    });
  } catch (error) {
    return null;
  }
}
