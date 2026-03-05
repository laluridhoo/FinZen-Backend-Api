/**
 * Data yang dikirim client saat POST /api/transactions
 * userId diambil dari JWT token, bukan dari body (untuk keamanan)
 */
export interface CreateTransactionRequest {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description?: string;
  category?: string;
}

/**
 * Data transaksi yang dikembalikan ke client
 * Mencakup semua informasi transaksi (tanpa data sensitif)
 */
export interface TransactionResponse {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  category: string | null;
  date: Date;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Response untuk list transaksi
 */
export interface TransactionListResponse {
  transactions: TransactionResponse[];
  total: number;
  count: number;
}
