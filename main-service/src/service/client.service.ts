import { prisma } from "../db/client";
import { ClientSchema } from "../schema/client.schema";

export async function createClient(payload: ClientSchema) {
  return await prisma.client.create({
    data: payload,
  });
}

export async function getAllClients(): Promise<ClientSchema[] | null> {
  return await prisma.client.findMany({
    include: { project: true },
  });
}

export async function getClientById(
  clientId: string
): Promise<ClientSchema | null> {
  return await prisma.client.findUnique({
    where: { id: clientId },
    include: { project: true },
  });
}

export async function updateClientById(
  clientId: string,
  payload: ClientSchema
): Promise<ClientSchema | null> {
  try {
    return await prisma.client.update({
      where: { id: clientId },
      data: payload,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteClientById(
  clientId: string
): Promise<ClientSchema | null> {
  try {
    return await prisma.client.delete({
      where: { id: clientId },
    });
  } catch (error) {
    return null;
  }
}
