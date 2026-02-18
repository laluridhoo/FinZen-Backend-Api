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
  await prisma.transaction.createMany({
    data: [
      {
        userId: users1.id,
        amount: 100,
        type: "income",
        category: "Gaji",
        description: "Gaji Bulanan",
        date: new Date("2024-01-01"),
      },
      {
        userId: users1.id,
        amount: 25000,
        type: "expense",
        category: "Konsumsi",
        description: "Makan Siang",
        date: new Date("2024-01-02"),
      },
    ],
  });
  console.log("Transaksi berhasil dibuat untuk User 1");
  console.log("Seeding selesai");
}

//4 eksekusi fungsi seed dengan pengamananan try-catch-finally
seed()
  .catch((error) => {
    //Menangani dan menangai error jika ada tipe data yang tidak sesuai atau masalah koneksi database
    console.error("Error saat seeding data:", error);
    process.exit(1); //Mematikan proses dengan kode error
  })
  .finally(async () => {
    //wajib menghentikan koneksi Prisma Client setelah selesai untuk mencegah memory leak
    await prisma.$disconnect();
  });
