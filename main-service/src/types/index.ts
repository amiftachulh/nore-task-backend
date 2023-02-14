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
