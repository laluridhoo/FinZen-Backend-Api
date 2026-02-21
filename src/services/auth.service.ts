import { isEmail } from "validator";
import { prisma } from "../config/database";
import type { RegisterRequest, RegisterResponse } from "../dtos/auth.dto";
import { hashPassword } from "../utils/password";

const PASSWORD_MIN_LENGTH = 8;

/**
 * Validasi bisnis register: format email, panjang password, dan unik email.
 * Hash password lalu simpan ke DB. Mengembalikan data user tanpa passwordHash.
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  if (!isEmail(data.email)) {
    throw new Error("Format email tidak valid");
  }

  if (data.password.length < PASSWORD_MIN_LENGTH) {
    throw new Error("Password minimal 8 karakter");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      passwordHash,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
