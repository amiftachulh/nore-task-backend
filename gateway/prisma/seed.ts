import { prisma } from "../src/db/client";
import bcrypt from "bcrypt";

async function main() {
  console.log("Start seeding...");

  await prisma.role.createMany({
    data: [
      { id: 1, nama: "Admin" },
      { id: 2, nama: "Project Manager" },
      { id: 3, nama: "Member" },
    ],
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      nama_lengkap: "Admin",
      username: "admin",
      password: hashedPassword,
      nomor_hp: "6289874658371",
      divisi: "Admin",
      role_id: 1,
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
