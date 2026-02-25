/**
 * Data yang dikirim client saat POST /auth/register
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Data user yang kita kembalikan ke client (tanpa passwordHash)
 * Sesuai kebutuhan response register
 */
export interface RegisterResponse {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Format response API yang konsisten untuk semua endpoint
 * Memudahkan client untuk handle response dengan format yang predicatable
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Data yang dikirim client saat POST /auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response untuk endpoint login: token + user
 */
export interface LoginResponse {
  token: string;
  user: RegisterResponse;
}
