import { isEmail } from "validator";
import { prisma } from "../config/database";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from "../dtos/auth.dto";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

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

/**
 * Business logic untuk login
 * - Cari user berdasarkan email
 * - Bandingkan password
 * - Jika valid, generate JWT dan kembalikan token + user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // Jangan beri tahu apakah email tidak ada, gunakan pesan kredensial umum
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await comparePassword(data.password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}
