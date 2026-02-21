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
