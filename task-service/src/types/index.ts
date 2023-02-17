export type ResponseService<T> = {
  code: number;
  data: T;
  err: string | null;
};

export type User = {
  id: string;
  nama_lengkap: string;
  username: string;
  nomor_hp: string;
  divisi: string;
  role: Role | null;
};

type Role = {
  id: number;
  nama: string;
};
