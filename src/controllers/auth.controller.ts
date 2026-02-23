import type { Request, Response } from "express";
import { register as registerService } from "../services/auth.service";
import type { RegisterRequest, RegisterResponse, ApiResponse } from "../dtos/auth.dto";

/**
 * Controller: Register - Menangani HTTP request untuk registrasi user baru
 *
 * Flow:
 * 1. Extract data dari request body
 * 2. Call service.register() untuk business logic
 * 3. Handle error dan return response dengan status code tepat
 */
export async function register(
  req: Request<unknown, unknown, RegisterRequest>,
  res: Response<ApiResponse<RegisterResponse>>
): Promise<void> {
  try {
    // 1. Ambil data dari request body
    const { email, password, name } = req.body;

    // 2. Validasi input dasar (basic validation)
    // Catatan: Validasi lebih detail ada di service
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
      return;
    }

    // 3. Call service untuk proses registrasi
    const newUser = await registerService({ email, password, name });

    // 4. Return response sukses dengan HTTP 201 (Created)
    res.status(201).json({
      success: true,
      data: newUser,
      message: "Registrasi berhasil",
    });
  } catch (error) {
    // 5. Handle error dengan status code yang sesuai
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server";

    // Determine HTTP status berdasarkan error message
    if (
      errorMessage.includes("Email sudah terdaftar") ||
      errorMessage.includes("already exists")
    ) {
      res.status(409).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    // Validation errors
    if (
      errorMessage.includes("tidak valid") ||
      errorMessage.includes("minimal") ||
      errorMessage.includes("Invalid")
    ) {
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    // Server error
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}
