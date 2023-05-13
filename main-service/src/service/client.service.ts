import { prisma } from "../db/client";
import { Client } from "@prisma/client";
import { ClientSchema } from "../schema/client.schema";
import axios from "axios";
import config from "../config";
import { ResponseService } from "../types";
import { makeResponse } from "../utils";

export async function createClient(payload: ClientSchema): Promise<ResponseService<null>> {
  try {
    await prisma.client.create({
      data: payload,
    });
    return makeResponse(201, "Client berhasil dibuat", null);
  } catch (error) {
    return makeResponse(400, "Client gagal dibuat", null);
  }
}

export async function getAllClients(): Promise<ResponseService<Client[] | null>> {
  const clients = await prisma.client.findMany({
    orderBy: { nama: "asc" },
  });

  if (!clients.length) return makeResponse(404, "Client tidak ditemukan", null);
  return makeResponse(200, "Success", clients);
}

export async function getClientById(clientId: string): Promise<ResponseService<Client | null>> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { project: true },
  });

  if (!client) return makeResponse(404, "Client tidak ditemukan", null);
  return makeResponse(200, "Success", client);
}

export async function updateClientById(
  clientId: string,
  payload: ClientSchema
): Promise<ResponseService<any>> {
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: payload,
    });
    return makeResponse(200, "Client berhasil diperbarui", null);
  } catch (error) {
    return makeResponse(400, "Client gagal diperbarui", error);
  }
}

export async function deleteClientById(clientId: string): Promise<ResponseService<null>> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { project: true },
  });

  if (!client) return makeResponse(404, "Client tidak ditemukan", null);

  const projectIds = client.project.map((p) => p.id);

  try {
    await axios.post(`${config.api.task}/event/delete-kategori-task`, { projectIds });
  } catch (error) {
    return makeResponse(500, "Terjadi kesalahan, silakan coba lagi nanti", null);
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  return makeResponse(200, "Client berhasil dihapus", null);
}
