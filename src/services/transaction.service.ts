import { prisma } from "../config/database";
import type { CreateTransactionRequest, TransactionResponse } from "../dtos/transaction.dto";

/**
 * Service: Create Transaction
 * - Validasi input (amount > 0, type valid)
 * - Insert ke database
 * - Return transaction data ke client
 *
 * @param data - Data transaksi dari request
 * @param userId - ID user (dari JWT token, bukan dari request body)
 * @returns Data transaksi yang baru dibuat
 */
export async function createTransaction(data: CreateTransactionRequest, userId: number): Promise<TransactionResponse> {
  // ===== VALIDASI INPUT =====

  // 1. Validasi amount
  if (!data.amount || typeof data.amount !== "number") {
    throw new Error("Amount harus berupa angka");
  }

  if (data.amount <= 0) {
    throw new Error("Amount harus lebih dari 0");
  }

  // 2. Validasi type
  const validTypes = ["INCOME", "EXPENSE"];
  if (!data.type || !validTypes.includes(data.type)) {
    throw new Error("Type harus INCOME atau EXPENSE");
  }

  // 3. Validasi description dan category (opsional, tapi jika ada harus string)
  if (data.description !== undefined && typeof data.description !== "string") {
    throw new Error("Description harus berupa string");
  }

  if (data.category !== undefined && typeof data.category !== "string") {
    throw new Error("Category harus berupa string");
  }

  // ===== INSERT KE DATABASE =====
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description ?? null,
        category: data.category ?? null,
        userId: userId,
      },
    });

    // ===== RETURN RESPONSE =====
    const response: TransactionResponse = {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type as "INCOME" | "EXPENSE",
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      userId: transaction.userId,
    };

    return response;
  } catch (error) {
    // Handle error dari Prisma atau database
    if (error instanceof Error) {
      // Jika error dari constraint foreign key (userId tidak ada)
      if (error.message.includes("foreign key")) {
        throw new Error("User tidak ditemukan");
      }
      throw error;
    }
    throw new Error("Gagal membuat transaksi");
  }
}

/**
 * Service: Get Transactions by User
 * - Ambil semua transaksi milik user tertentu
 * - Return array transaksi
 *
 * @param userId - ID user pemilik transaksi
 * @returns Array of TransactionResponse
 */
export async function getTransactionsByUser(userId: number): Promise<TransactionResponse[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" }, // Terbaru duluan
    });

    return transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      type: t.type as "INCOME" | "EXPENSE",
      description: t.description,
      category: t.category,
      date: t.date,
      userId: t.userId,
    }));
  } catch (error) {
    throw new Error("Gagal mengambil data transaksi");
  }
}

/**
 * Service: Delete Transaction
 * - Hapus transaksi berdasarkan ID
 * - Verifikasi bahwa transaksi milik user (security check)
 *
 * @param transactionId - ID transaksi yang akan dihapus
 * @param userId - ID user (untuk memastikan hanya pemilik bisa hapus)
 * @returns Pesan sukses
 */
export async function deleteTransaction(transactionId: number, userId: number): Promise<void> {
  try {
    // Cek apakah transaksi ada dan milik user
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaksi tidak ditemukan");
    }

    if (transaction.userId !== userId) {
      throw new Error("Anda tidak memiliki akses untuk menghapus transaksi ini");
    }

    // Hapus transaksi
    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal menghapus transaksi");
  }
}
