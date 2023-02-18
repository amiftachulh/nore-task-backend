import { prisma } from "../db/client";
import { Client } from "@prisma/client";
import { ClientSchema } from "../schema/client.schema";

export async function createClient(
  payload: ClientSchema
): Promise<Client | null> {
  return await prisma.client.create({
    data: payload,
  });
}

export async function getAllClients(): Promise<Client[] | null> {
  const clients = await prisma.client.findMany({
    include: { project: true },
  });
  if (!clients.length) return null;
  return clients;
}

export async function getClientById(clientId: string): Promise<Client | null> {
  return await prisma.client.findUnique({
    where: { id: clientId },
    include: { project: true },
  });
}

export async function updateClientById(
  clientId: string,
  payload: ClientSchema
): Promise<Client | null> {
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
): Promise<Client | null> {
  try {
    return await prisma.client.delete({
      where: { id: clientId },
    });
  } catch (error) {
    return null;
  }
}
