import { PrismaClient } from "@prisma/client";

//Menginisialisasi Prisma Client
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding data...");
  //1. membersihkan data lama. Ini bersifat opsional,
  //Perhatian: Hapus data "anak" (Transaksi) dulu, baru "induk" (User)
  //untuk mencegah foreign key constraint error
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  console.log("Data lama dihapus");

  const users1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "User 1",
      passwordHash: "password1",
    },
  });
  console.log(`user berhasil dibuat: ${users1.name} email: ${users1.email}`);
 // 3. Membuat Data Transaksi Yang terhubung ke User Induk
