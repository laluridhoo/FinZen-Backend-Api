import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash password plain text menjadi string aman untuk disimpan di DB.
 * Digunakan saat register.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Bandingkan password plain dengan hash (untuk login nanti).
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
