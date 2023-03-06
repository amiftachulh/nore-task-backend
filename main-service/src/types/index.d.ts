export type User = {
  id: string;
  namaLengkap: string;
  username: string;
  nomorHp: string;
  divisi: string;
  role: Role | null;
};

type Role = {
  id: number;
  nama: string;
};

export type ResponseService<T> = {
  code: number;
  message: string;
  data: T;
};
